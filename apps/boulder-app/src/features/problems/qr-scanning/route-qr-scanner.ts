import type { Grade } from '@crux/shared-types';
import jsQR from 'jsqr';
import { inferGradeFromQrBorder, type QrCodeBounds } from './route-grade-color-sampler';

interface BarcodeResult {
  rawValue: string;
  boundingBox?: QrCodeBounds;
}
interface BarcodeScanner { detect(source: CanvasImageSource): Promise<BarcodeResult[]> }
interface BarcodeScannerConstructor { new(options?: { formats: string[] }): BarcodeScanner }
declare global { interface Window { BarcodeDetector?: BarcodeScannerConstructor } }

type Crop = { x: number; y: number; width: number; height: number };
interface DecodedQr { url: string; bounds?: QrCodeBounds }
export interface RouteQrScanResult { url: string; grade?: Grade }

/** Create a scanner that shares its detector and canvas across camera frames. */
export function createRouteQrScanner() {
  const videoCanvas = document.createElement('canvas');
  const videoContext = videoCanvas.getContext('2d', { willReadFrequently: true });
  let native: BarcodeScanner | null = null;
  try {
    native = window.BarcodeDetector ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
  } catch {
    // Unsupported detector configurations fall through to jsQR and ZXing.
  }

  const decodeNative = async (source: CanvasImageSource): Promise<DecodedQr | null> => {
    if (!native) return null;
    try {
      const result = (await native.detect(source))[0];
      return result ? { url: result.rawValue, bounds: result.boundingBox } : null;
    } catch {
      return null;
    }
  };

  const decodeWithJsQr = (
    source: CanvasImageSource,
    width: number,
    height: number,
    maxSide: number,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null,
    inversion: 'dontInvert' | 'attemptBoth',
    crop?: Crop,
  ): DecodedQr | null => {
    if (!context) throw new Error('Could not create a canvas context.');
    const region = crop ?? { x: 0, y: 0, width, height };
    const scale = Math.min(1, maxSide / Math.max(region.width, region.height));
    canvas.width = Math.max(1, Math.round(region.width * scale));
    canvas.height = Math.max(1, Math.round(region.height * scale));
    context.drawImage(source, region.x, region.y, region.width, region.height, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: inversion });
    if (!result) return null;
    const corners = Object.values(result.location);
    const left = Math.min(...corners.map((point) => point.x));
    const top = Math.min(...corners.map((point) => point.y));
    const right = Math.max(...corners.map((point) => point.x));
    const bottom = Math.max(...corners.map((point) => point.y));
    return {
      url: result.data,
      bounds: {
        x: region.x + left / scale,
        y: region.y + top / scale,
        width: (right - left) / scale,
        height: (bottom - top) / scale,
      },
    };
  };

  const toScanResult = (decoded: DecodedQr, source: CanvasImageSource, width: number, height: number): RouteQrScanResult => ({
    url: decoded.url,
    grade: decoded.bounds ? inferGradeFromQrBorder(source, width, height, decoded.bounds) : undefined,
  });

  return {
    async scanVideoFrame(video: HTMLVideoElement): Promise<RouteQrScanResult | null> {
      const decoded = await decodeNative(video)
        ?? decodeWithJsQr(video, video.videoWidth, video.videoHeight, 640, videoCanvas, videoContext, 'dontInvert');
      return decoded ? toScanResult(decoded, video, video.videoWidth, video.videoHeight) : null;
    },

    async scanPhoto(file: File): Promise<RouteQrScanResult | null> {
      const bitmap = await createImageBitmap(file);
      try {
        const { width, height } = bitmap;
        const photoCanvas = document.createElement('canvas');
        const photoContext = photoCanvas.getContext('2d', { willReadFrequently: true });
        const side = Math.min(width, height);
        const centerX = width / 2;
        const centerY = height * 0.46;
        // Try the full photo first, then tighter crops to remove wall detail around small codes.
        const crops: (Crop | undefined)[] = [
          undefined,
          { x: (width - side) / 2, y: (height - side) / 2, width: side, height: side },
          { x: Math.max(0, centerX - side * 0.36), y: Math.max(0, centerY - side * 0.36), width: Math.min(width, side * 0.72), height: Math.min(height, side * 0.72) },
        ];

        const nativeValue = await decodeNative(bitmap);
        if (nativeValue) return toScanResult(nativeValue, bitmap, width, height);
        for (const crop of crops) {
          const value = decodeWithJsQr(bitmap, width, height, 1600, photoCanvas, photoContext, 'attemptBoth', crop);
          if (value) return toScanResult(value, bitmap, width, height);
        }

        // ZXing is an independent fallback for photos jsQR cannot decode; load it only when needed.
        const imageUrl = URL.createObjectURL(file);
        try {
          const image = new Image();
          image.src = imageUrl;
          await image.decode();
          const { BrowserQRCodeReader } = await import('@zxing/browser');
          const result = await new BrowserQRCodeReader().decodeFromImageElement(image);
          const points = result.getResultPoints().map((point) => ({ x: point.getX(), y: point.getY() }));
          const left = Math.min(...points.map((point) => point.x));
          const top = Math.min(...points.map((point) => point.y));
          const right = Math.max(...points.map((point) => point.x));
          const bottom = Math.max(...points.map((point) => point.y));
          const bounds = points.length ? { x: left, y: top, width: right - left, height: bottom - top } : undefined;
          return toScanResult({ url: result.getText(), bounds }, bitmap, width, height);
        } catch {
          return null;
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      } finally {
        bitmap.close();
      }
    },
  };
}
