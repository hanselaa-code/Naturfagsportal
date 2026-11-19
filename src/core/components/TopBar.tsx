import {
  ArrowLeft,
  Atom,
  BookOpenCheck,
  Compass,
  HeartPulse,
  QrCode,
  TreeDeciduous,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PortalTopBarProps {
  overallPercentage?: number;
  onOpenQrModal?: () => void;
}

const MODULE_LINKS = [
  { path: '/big-bang', label: 'Big Bang', icon: Atom, color: 'text-amber-300' },
  { path: '/helse-ernering', label: 'Helse & Ernæring', icon: HeartPulse, color: 'text-sky-300' },
  { path: '/livets-tre', label: 'Livets tre', icon: TreeDeciduous, color: 'text-emerald-300' },
];

export function PortalTopBar({
  overallPercentage,
  onOpenQrModal,
}: PortalTopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080D1A]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {!isHome ? (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-sky-400/50 hover:bg-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Til portalen
            </button>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 ring-1 ring-sky-400/30">
              <Compass className="h-5 w-5 text-sky-300" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold tracking-tight text-slate-100 sm:text-base">
                Naturfag Vg1
              </span>
              <span className="rounded-md bg-sky-500/15 px-2 py-0.5 font-mono-time text-[10px] font-semibold text-sky-300 ring-1 ring-sky-400/25">
                NAT01-05
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Samlet interaktiv læringsportal
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1.5 md:flex">
          {MODULE_LINKS.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'bg-slate-800 text-white ring-1 ring-white/15'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {onOpenQrModal && (
            <button
              id="btn-portal-qr"
              type="button"
              onClick={onOpenQrModal}
              title="Vis QR-kode for hovedsiden (K)"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/35 bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:border-sky-400/60 hover:bg-sky-500/25 cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5 text-sky-300" />
              <span>QR-kode</span>
              <kbd className="hidden md:inline-block rounded bg-black/25 px-1.5 py-0.5 font-mono-time text-[10px] text-sky-200/90">
                K
              </kbd>
            </button>
          )}

          {typeof overallPercentage === 'number' && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs">
              <BookOpenCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-400 hidden sm:inline">Total progresjon:</span>
              <span className="font-mono-time font-semibold text-slate-100">
                {overallPercentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
