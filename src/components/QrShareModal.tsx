import { Check, Copy, QrCode, Smartphone, X } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';

export const DEFAULT_PUBLIC_PORTAL_URL =
  'https://hanselaa-code.github.io/naturfag-vg1/';

export type QrShareAccent = 'emerald' | 'amber' | 'violet' | 'sky';

export interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  routePath: string;
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  accent?: QrShareAccent;
}

const ACCENT_STYLES: Record<
  QrShareAccent,
  {
    badge: string;
    qrGlow: string;
    urlText: string;
    copyBtn: string;
    icon: string;
  }
> = {
  emerald: {
    badge: 'bg-emerald-500/15 border-emerald-400/35 text-emerald-300',
    qrGlow: 'shadow-[0_0_40px_rgba(16,185,129,0.22)]',
    urlText: 'text-emerald-300',
    copyBtn: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950',
    icon: 'text-emerald-300',
  },
  amber: {
    badge: 'bg-amber-500/15 border-amber-400/35 text-amber-300',
    qrGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.22)]',
    urlText: 'text-amber-300',
    copyBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    icon: 'text-amber-300',
  },
  violet: {
    badge: 'bg-violet-500/15 border-violet-400/35 text-violet-300',
    qrGlow: 'shadow-[0_0_40px_rgba(167,139,250,0.24)]',
    urlText: 'text-violet-300',
    copyBtn: 'bg-violet-400 hover:bg-violet-300 text-slate-950',
    icon: 'text-violet-300',
  },
  sky: {
    badge: 'bg-sky-500/15 border-sky-400/35 text-sky-300',
    qrGlow: 'shadow-[0_0_40px_rgba(56,189,248,0.24)]',
    urlText: 'text-sky-300',
    copyBtn: 'bg-sky-400 hover:bg-sky-300 text-slate-950',
    icon: 'text-sky-300',
  },
};

export function buildPublicShareUrl(routePath?: string): string {
  let baseUrl = DEFAULT_PUBLIC_PORTAL_URL;

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

  const trimmed = (routePath ?? '').trim();
  if (!trimmed || trimmed === '/') {
    return baseUrl;
  }

  const normalizedRoute = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${baseUrl}#${normalizedRoute}`;
}

export function QrShareModal({
  isOpen,
  onClose,
  routePath,
  title,
  subtitle,
  badgeLabel = 'Del side',
  accent = 'sky',
}: QrShareModalProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const shareUrl = useMemo(() => buildPublicShareUrl(routePath), [routePath]);
  const styles = ACCENT_STYLES[accent];

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    QRCode.toString(shareUrl, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0B1120',
        light: '#FFFFFF',
      },
    })
      .then((svg) => {
        if (active) setSvgMarkup(svg);
      })
      .catch(() => {
        if (active) setSvgMarkup('');
      });

    return () => {
      active = false;
    };
  }, [isOpen, shareUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      id="qr-share-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-share-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 animate-card-enter"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-3xl glass-panel p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-700/70"
      >
        <button
          id="btn-close-qr-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Lukk QR-vindu"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${styles.badge}`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>{badgeLabel}</span>
          </div>

          <h2
            id="qr-share-modal-title"
            className="text-xl sm:text-2xl font-extrabold text-white font-display leading-snug"
          >
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center gap-1.5">
            <Smartphone className={`w-4 h-4 shrink-0 ${styles.icon}`} />
            <span>
              {subtitle ?? `Skann for å åpne «${title}» direkte på mobil`}
            </span>
          </p>
        </div>

        <div
          className={`mx-auto w-64 h-64 sm:w-76 sm:h-76 p-4 rounded-2xl bg-white flex items-center justify-center ${styles.qrGlow}`}
        >
          {svgMarkup ? (
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          ) : (
            <span className="text-slate-600 text-sm font-medium">
              Genererer QR-kode…
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          <div
            className={`px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono-time text-xs sm:text-sm select-all break-all ${styles.urlText}`}
          >
            {shareUrl}
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <button
              id="btn-copy-share-url"
              type="button"
              onClick={() => void handleCopy()}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-colors cursor-pointer ${styles.copyBtn}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Lenke kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopier lenke til Teams / Classroom</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
