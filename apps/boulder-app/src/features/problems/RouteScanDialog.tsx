import type { AttemptCategory, Grade, Member, Problem } from '@crux/shared-types';
import type { SendDraft } from '../sends/SendDialog';

import jsQR from 'jsqr';
import { useEffect, useRef, useState } from 'react';
import { localDateString } from '../../domain/date';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Field, Input, ModalBackdrop, ModalCard, Pill, Row, SectionTitle, Stack } from '../../components/ui';
import { DialogFooter, SendFormFields } from '../sends/SendFormFields';
import { GradePicker } from '../sends/GradePicker';

const DEFAULT_NAMES = ['Gravity snacks', 'Mushroom kingdom', 'Tiny victories', 'Chalk and awe', 'Good noodles', 'Purple haze', 'Side quest'];
const randomName = () => DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)];

export function routeIdentifier(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const segment = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean).at(-1);
    return segment || null;
  } catch {
    return null;
  }
}

interface BarcodeResult { rawValue: string }
interface BarcodeScanner { detect(video: HTMLVideoElement): Promise<BarcodeResult[]> }
interface BarcodeScannerConstructor { new(options?: { formats: string[] }): BarcodeScanner }
declare global { interface Window { BarcodeDetector?: BarcodeScannerConstructor } }

/** Draw a video frame / bitmap onto a canvas (downscaled) and decode it with jsQR. */
function decodeQr(
  source: CanvasImageSource,
  width: number,
  height: number,
  maxSide: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  inversion: 'dontInvert' | 'attemptBoth',
): string | null {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(img.data, img.width, img.height, { inversionAttempts: inversion })?.data || null;
}

export function RouteScanDialog({ problems, members, currentMemberId, onClose, onExisting, onCreate }: {
  problems: Problem[];
  members: Member[];
  currentMemberId: string;
  onClose: () => void;
  onExisting: (problem: Problem) => void;
  onCreate: (problem: Problem, send: SendDraft | null) => void;
}) {
  const [url, setUrl] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [grade, setGrade] = useState<Grade>('Green');
  const [name, setName] = useState('');
  const [logSend, setLogSend] = useState(true);
  const [memberId, setMemberId] = useState(currentMemberId);
  const [attempt, setAttempt] = useState<AttemptCategory>('flash');
  const [date, setDate] = useState(localDateString());
  const [error, setError] = useState('');
  const [camera, setCamera] = useState(false);
  const [cameraMessage, setCameraMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const checkUrl = (value: string) => {
    const routeId = routeIdentifier(value);
    if (!routeId) {
      setError('That URL does not contain a route identifier.');
      setIdentifier('');
      return;
    }
    setError('');
    setUrl(value.trim());
    setIdentifier(routeId);
    const existing = problems.find((problem) => problem.qrIdentifier === routeId);
    if (existing) {
      onExisting(existing);
      return;
    }
    // Only pick a new random name when the route actually changed
    setName((prev) => (routeId === identifier && prev ? prev : randomName()));
  };

  // The camera effect only depends on [camera], so always call the latest checkUrl via a ref
  const checkUrlRef = useRef(checkUrl);
  checkUrlRef.current = checkUrl;

  useEffect(() => {
    if (!camera) return;
    let stream: MediaStream | null = null;
    let timer: number | undefined;
    let cancelled = false;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const fail = (message: string) => {
      if (cancelled) return;
      setCameraMessage(message);
      setCamera(false);
    };

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        fail('Camera access is unavailable (it needs HTTPS or a regular browser, not an in-app one). Use "Scan from photo" or paste the link.');
        return;
      }
      setCameraMessage('Starting camera…');
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        video.setAttribute('playsinline', 'true'); // required on iOS
        video.muted = true;
        video.srcObject = stream;
        await video.play();
        if (cancelled) return;

        // Native detector where it works, jsQR everywhere else (iOS Safari, Firefox)
        let native: BarcodeScanner | null = null;
        try {
          native = window.BarcodeDetector ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
        } catch {
          native = null;
        }

        setCameraMessage('Hold the route QR code inside the frame.');

        const tick = async () => {
          if (cancelled) return;
          if (video.readyState >= 2 && video.videoWidth) {
            let value: string | null = null;
            try {
              if (native) {
                const found = await native.detect(video);
                value = found[0]?.rawValue ?? null;
              } else if (ctx) {
                value = decodeQr(video, video.videoWidth, video.videoHeight, 640, canvas, ctx, 'dontInvert');
              }
            } catch {
              /* frame not ready; keep scanning */
            }

            if (value && !cancelled) {
              setCameraMessage('');
              checkUrlRef.current(value);
              setCamera(false);
              return;
            }
          }
          timer = window.setTimeout(tick, 150);
        };
        void tick();
      } catch (err) {
        const errName = (err as DOMException | undefined)?.name;
        if (errName === 'NotAllowedError' || errName === 'SecurityError') {
          fail('Camera permission was not granted. Allow camera access in your browser settings, or use "Scan from photo".');
        } else if (errName === 'NotFoundError' || errName === 'OverconstrainedError') {
          fail('No camera was found on this device. Use "Scan from photo" or paste the link.');
        } else {
          fail('Could not start the camera. Use "Scan from photo" or paste the link.');
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [camera]);

  const onPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow picking the same photo again
    if (!file) return;
    setCameraMessage('');
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('no canvas');
      const value = decodeQr(bitmap, bitmap.width, bitmap.height, 1280, canvas, ctx, 'attemptBoth');
      bitmap.close();
      if (value) {
        checkUrl(value);
      } else {
        setError('No QR code found in that photo. Try again closer, in good light, with the whole code visible.');
      }
    } catch {
      setError('Could not read that image.');
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const routeId = routeIdentifier(url);
    if (!routeId) {
      setError('Enter a valid route QR URL first.');
      return;
    }
    const problem: Problem = {
      id: `problem-${crypto.randomUUID()}`,
      name: name.trim() || 'New route',
      grade,
      createdAt: date,
      creatorId: currentMemberId,
      qrIdentifier: routeId,
      routeUrl: url,
      explorerIds: [currentMemberId],
    };
    onCreate(problem, logSend ? { memberId, problemId: problem.id, grade, attempt, date } : null);
  };

  return <ModalBackdrop onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <ModalCard as="form" role="dialog" aria-modal="true" aria-labelledby="scan-title" onSubmit={submit}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>Find or add a route</Eyebrow>
          <SectionTitle id="scan-title" style={{ fontSize: 26 }}>Scan a wall QR</SectionTitle>
          <p style={{ margin: '7px 0 0', color: 'var(--color-text-muted)' }}>Crux Club checks the global catalog before creating a problem.</p>
        </div>
        <Button type="button" $variant="quiet" aria-label="Close" onClick={onClose}><Icon name="close" /></Button>
      </Row>

      <Stack $gap="13px" style={{ marginTop: 18 }}>
        {camera && (
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 15, background: '#211d24', aspectRatio: '4 / 3', maxHeight: 260, width: '100%' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: '15% 18%', border: '2px solid #e6f1e8', borderRadius: 14, boxShadow: '0 0 0 999px #0005', pointerEvents: 'none' }} />
          </div>
        )}

        <Row $wrap>
          <Button
            type="button"
            $variant={camera ? 'secondary' : 'quiet'}
            onClick={() => { setCameraMessage(''); setCamera((value) => !value); }}
          >
            <Icon name="scan" />{camera ? 'Stop camera' : 'Open camera'}
          </Button>
          <Button type="button" $variant="quiet" onClick={() => photoInputRef.current?.click()}>
            <Icon name="scan" />Scan from photo
          </Button>
          <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={onPhoto} hidden />
        </Row>
        <small style={{ color: 'var(--color-text-muted)' }}>
          {cameraMessage || 'Camera use stays in this browser.'}
        </small>

        <Field>
          Route QR URL
          <Input
            type="url"
            value={url}
            onChange={(event) => { setUrl(event.target.value); setError(''); setIdentifier(''); }}
            onBlur={(event) => { if (event.target.value.trim()) checkUrl(event.target.value); }}
            placeholder="https://beta7.app/route/…"
            required
          />
        </Field>
        {error && <p role="alert" style={{ margin: 0, color: '#a84f54', fontSize: 12 }}>{error}</p>}
        {identifier && <Pill $tone="green">Route code · {identifier}</Pill>}
        {identifier && <>
          <Field>Problem name<Input value={name} maxLength={50} onChange={(event) => setName(event.target.value)} required /></Field>
          <Field as="div">Hold color / level<GradePicker value={grade} onChange={setGrade} /></Field>
          <Pill $tone="orange"><Icon name="spark" size={14} />Explorer · adds an insignia, not points</Pill>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13 }}>
            <input type="checkbox" checked={logSend} onChange={(event) => setLogSend(event.target.checked)} /> Log a send while creating the problem
          </label>
          {logSend && <SendFormFields members={members} currentMemberId={currentMemberId} memberId={memberId} onMemberId={setMemberId} attempt={attempt} onAttempt={setAttempt} date={date} onDate={setDate} grade={grade} firstSend />}
        </>}
      </Stack>

      <DialogFooter>
        <Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!identifier}>{logSend ? 'Create problem + send' : 'Create problem'}</Button>
      </DialogFooter>
    </ModalCard>
  </ModalBackdrop>;
}