import type { Grade } from '@crux/shared-types';
import { pickGradeFromRouteColor, type RgbColorSample } from './route-grade-color-picker';

export interface QrCodeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Estimate the grade by sampling the route-tag pixels just outside the QR code. */
export function inferGradeFromQrBorder(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  bounds: QrCodeBounds,
): Grade | undefined {
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1280 / Math.max(sourceWidth, sourceHeight));
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return undefined;
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

  const x = bounds.x * scale;
  const y = bounds.y * scale;
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  const gap = width * 0.08;
  const depth = width * 0.62;
  const sampleTop = y + height * 0.2;
  const sampleBottom = y + height * 0.8;
  const regions = [
    { left: x - depth, right: x - gap, top: sampleTop, bottom: sampleBottom },
    { left: x + width + gap, right: x + width + depth, top: sampleTop, bottom: sampleBottom },
  ];

  return pickGradeFromRouteColor(readRegionColors(pixels.data, canvas.width, canvas.height, regions));
}

function* readRegionColors(
  data: Uint8ClampedArray,
  canvasWidth: number,
  canvasHeight: number,
  regions: { left: number; right: number; top: number; bottom: number }[],
): Iterable<RgbColorSample> {
  for (const region of regions) {
    const left = Math.max(0, Math.floor(region.left));
    const right = Math.min(canvasWidth, Math.ceil(region.right));
    const top = Math.max(0, Math.floor(region.top));
    const bottom = Math.min(canvasHeight, Math.ceil(region.bottom));
    for (let y = top; y < bottom; y += 3) {
      for (let x = left; x < right; x += 3) {
        const offset = (y * canvasWidth + x) * 4;
        yield { red: data[offset], green: data[offset + 1], blue: data[offset + 2] };
      }
    }
  }
}
