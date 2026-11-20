import {
  Check,
  Clock,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import {
  formatNorwegianDateTime,
  getGradingScaleShortLabel,
  type Assignment,
} from '../types';

const DEFAULT_PORTAL_BASE = 'https://hanselaa-code.github.io/Naturfagsportal/';

export function buildAssignmentShareUrl(assignment: Assignment): string {
  let baseUrl = DEFAULT_PORTAL_BASE;

  if (typeof window !== 'undefined') {
    const { protocol, hostname, origin, pathname } = window.location;
    const isPublicWeb =
      (protocol === 'https:' || protocol === 'http:') &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1' &&
      hostname !== '[::1]';

    if (isPublicWeb) {
      const cleanPath = pathname.endsWith('.html')
        ? pathname
        : pathname.endsWith('/')
          ? pathname
          : `${pathname}/`;
      baseUrl = `${origin}${cleanPath}`;
    }
  }

  return `${baseUrl}#/innlevering/oppgave/${encodeURIComponent(
    assignment.id,
  )}?klasse=${encodeURIComponent(assignment.classId)}`;
}

interface AssignmentQrModalProps {
  assignment: Assignment | null;
  className: string;
  onClose: () => void;
}

export function AssignmentQrModal({
  assignment,
  className,
  onClose,
}: AssignmentQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [boardMode, setBoardMode] = useState(false);

  const shareUrl = useMemo(
    () => (assignment ? buildAssignmentShareUrl(assignment) : ''),
    [assignment],
  );

  useEffect(() => {
    if (!assignment || !shareUrl) return;
    let active = true;

    QRCode.toDataURL(shareUrl, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0B1120',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });

    return () => {
      active = false;
    };
  }, [assignment, shareUrl]);

  useEffect(() => {
    if (!assignment) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (boardMode) {
          setBoardMode(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [assignment, boardMode, onClose]);

  if (!assignment) return null;

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const safeName = assignment.title
      .toLowerCase()
      .replace(/[^a-z0-9æøå_-]+/gi, '-')
      .replace(/^-+|-+$/g, '');
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-${className}-${safeName || 'oppgave'}.png`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`glass-panel relative w-full rounded-3xl border border-sky-400/35 bg-[#0B1222] shadow-2xl transition-all ${
          boardMode ? 'max-w-3xl p-8 sm:p-10' : 'max-w-lg p-6'
        }`}
      >
        {/* Top bar */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/35 bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-sky-200">
                <QrCode className="h-3.5 w-3.5" />
                Klasse {className}
              </span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300">
                {getGradingScaleShortLabel(assignment.gradingScale)}
              </span>
            </div>
            <h3
              className={`font-display font-extrabold text-white ${
                boardMode ? 'text-2xl sm:text-3xl' : 'text-lg'
              }`}
            >
              {assignment.title}
            </h3>
            {assignment.dueDate && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Frist: {formatNorwegianDateTime(assignment.dueDate)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setBoardMode((prev) => !prev)}
              title={boardMode ? 'Normal størrelse' : 'Tavlemodus (stor QR)'}
              className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-sky-400/40 hover:text-white"
            >
              {boardMode ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Lukk"
              className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-rose-400/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* QR Code Box */}
        <div className="my-5 flex flex-col items-center">
          <div
            className={`rounded-3xl bg-white p-4 shadow-[0_0_50px_rgba(56,189,248,0.22)] ${
              boardMode ? 'w-80 sm:w-96' : 'w-56 sm:w-64'
            }`}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR-kode for ${assignment.title}`}
                className="h-auto w-full rounded-xl"
              />
            ) : (
              <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-200" />
            )}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            Krever elevinnlogging • Går rett til oppgaven etter innlogging
          </div>
        </div>

        {/* Share URL + Action Buttons */}
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Direkte lenke (klar for Teams)
            </p>
            <p className="break-all font-mono text-xs text-sky-300">
              {shareUrl}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-sky-400"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Kopier til Teams
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-sky-400/40 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Last ned PNG
            </button>

            <button
              type="button"
              onClick={() => setBoardMode((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-sky-400/40 hover:text-white"
            >
              {boardMode ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  Normal visning
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  Vis på tavle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
