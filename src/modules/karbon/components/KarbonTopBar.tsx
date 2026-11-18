import {
  Atom,
  Check,
  ChevronDown,
  FlaskConical,
  Flame,
  Globe2,
  Hexagon,
  Layers,
  Network,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  KARBON_CENTER_NODE,
  KARBON_THEME_LIST,
  KARBON_THEMES,
  type KarbonAppView,
} from '../data/karbonThemes';

export function getKarbonIcon(view: KarbonAppView) {
  switch (view) {
    case 'karbon':
      return Network;
    case 'atommodell-bindinger':
      return Atom;
    case 'karbonatomet':
      return Hexagon;
    case 'hydrokarboner':
      return Flame;
    case 'alkoholer':
      return FlaskConical;
    case 'karboksylsyrer-estere':
      return Sparkles;
    case 'polymerer-plast':
      return Layers;
    case 'karbonsyklusen':
    default:
      return Globe2;
  }
}

interface KarbonTopBarProps {
  activeView: KarbonAppView;
  onSelectView: (view: KarbonAppView) => void;
}

export function KarbonTopBar({ activeView, onSelectView }: KarbonTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isHub = activeView === 'karbon';
  const activeMeta = !isHub ? KARBON_THEMES[activeView] : null;

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const ActiveIcon = getKarbonIcon(activeView);
  const activeBadge = isHub
    ? KARBON_CENTER_NODE.dropdownBadge
    : activeMeta!.dropdownBadge;
  const activeTitle = isHub
    ? KARBON_CENTER_NODE.dropdownTitle
    : activeMeta!.dropdownTitle;

  return (
    <header className="relative z-30 flex items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 border-b border-slate-800/80 bg-[#090E1A]/90 backdrop-blur-md">
      <div
        ref={dropdownRef}
        className="relative flex items-center gap-2.5 sm:gap-3 min-w-0"
      >
        <button
          id="btn-karbon-theme-switcher"
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          title="Velg undertema i Karbon"
          className="group flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 border border-violet-400/35 hover:border-violet-400/65 transition-all cursor-pointer min-w-0 text-left shadow-[0_0_24px_rgba(167,139,250,0.12)]"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500/25 to-sky-500/20 border border-violet-400/35 flex items-center justify-center shrink-0">
            <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-300" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300/90 hidden sm:inline">
                {isHub ? 'Hovedside' : 'Undertema'}
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-[10px] font-mono text-amber-300/90 truncate hidden sm:inline">
                {activeBadge}
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="text-xs sm:text-base lg:text-lg font-extrabold text-white truncate font-display">
                {activeTitle}
              </h1>
              <ChevronDown
                className={`w-4 h-4 text-violet-300 shrink-0 transition-transform duration-200 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </button>

        <p className="text-xs text-slate-400 hidden 2xl:block truncate max-w-md">
          {isHub
            ? KARBON_CENTER_NODE.dropdownDescription
            : activeMeta!.dropdownDescription}
        </p>

        {menuOpen && (
          <div
            role="listbox"
            aria-label="Velg undertema i Karbon"
            className="absolute left-0 top-full mt-2 w-[min(92vw,26rem)] max-h-[75vh] overflow-y-auto p-2 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-700/90 shadow-2xl z-50 space-y-1.5"
          >
            <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Karbon • Oversikt &amp; undertemaer
            </div>

            <button
              id="karbon-option-hub"
              type="button"
              role="option"
              aria-selected={isHub}
              onClick={() => {
                onSelectView('karbon');
                setMenuOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isHub
                  ? 'bg-violet-500/18 border-violet-400/50 text-white'
                  : 'bg-slate-900/75 hover:bg-slate-800/90 border-slate-800 hover:border-slate-600 text-slate-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                  isHub
                    ? 'bg-violet-400 text-slate-950 border-violet-300'
                    : 'bg-slate-800/90 text-violet-300 border-slate-700'
                }`}
              >
                <Network className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold font-display text-white">
                    {KARBON_CENTER_NODE.dropdownTitle}
                  </span>
                  {isHub && (
                    <Check className="w-4 h-4 text-violet-300 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-amber-300/90 mt-0.5">
                  {KARBON_CENTER_NODE.dropdownBadge}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  {KARBON_CENTER_NODE.dropdownDescription}
                </p>
              </div>
            </button>

            <div className="px-2.5 pt-1.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Velg undertema ({KARBON_THEME_LIST.length})
            </div>

            {KARBON_THEME_LIST.map((item) => {
              const isCurrent = !isHub && item.id === activeView;
              const ItemIcon = getKarbonIcon(item.id);

              return (
                <button
                  key={item.id}
                  id={`karbon-option-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={isCurrent}
                  onClick={() => {
                    onSelectView(item.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-violet-500/18 border-violet-400/50 text-white'
                      : 'bg-slate-900/75 hover:bg-slate-800/90 border-slate-800 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                      isCurrent
                        ? 'bg-violet-400 text-slate-950 border-violet-300'
                        : 'bg-slate-800/90 text-violet-300 border-slate-700'
                    }`}
                  >
                    <ItemIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold font-display text-white">
                        {item.order}. {item.dropdownTitle}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!item.ready && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                            Meny klar
                          </span>
                        )}
                        {isCurrent && (
                          <Check className="w-4 h-4 text-violet-300" />
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300/90 mt-0.5">
                      {item.dropdownBadge}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      {item.dropdownDescription}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!isHub && (
        <button
          type="button"
          onClick={() => onSelectView('karbon')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <Network className="w-3.5 h-3.5 text-violet-300" />
          <span>Tilbake til oversikt</span>
        </button>
      )}
    </header>
  );
}
