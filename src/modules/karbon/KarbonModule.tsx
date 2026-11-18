import { ArrowLeft, ArrowRight, Construction } from 'lucide-react';
import { useEffect, useState } from 'react';
import { progressService } from '../../core/storage';
import { KarbonHub } from './components/KarbonHub';
import { getKarbonIcon, KarbonTopBar } from './components/KarbonTopBar';
import {
  KARBON_THEME_LIST,
  KARBON_THEMES,
  type KarbonAppView,
} from './data/karbonThemes';

export function KarbonModule() {
  const [activeView, setActiveView] = useState<KarbonAppView>('karbon');

  useEffect(() => {
    progressService.markModuleVisited('kjemiske-bindinger');
  }, []);

  useEffect(() => {
    const title =
      activeView === 'karbon'
        ? 'Karbon – Oversikt'
        : KARBON_THEMES[activeView].title;
    document.title = `${title} | Naturfag Vg1`;
  }, [activeView]);

  const activeMeta = activeView === 'karbon' ? null : KARBON_THEMES[activeView];
  const currentIdx = activeMeta
    ? KARBON_THEME_LIST.findIndex((t) => t.id === activeMeta.id)
    : -1;
  const prevTheme =
    currentIdx > 0 ? KARBON_THEME_LIST[currentIdx - 1] : null;
  const nextTheme =
    currentIdx >= 0 && currentIdx < KARBON_THEME_LIST.length - 1
      ? KARBON_THEME_LIST[currentIdx + 1]
      : null;

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#080D1A] text-slate-100 overflow-x-hidden lg:overflow-hidden relative">
      <KarbonTopBar activeView={activeView} onSelectView={setActiveView} />

      {activeView === 'karbon' ? (
        <KarbonHub onSelectTheme={(id) => setActiveView(id)} />
      ) : (
        activeMeta && (
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/75 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getKarbonIcon(activeMeta.id);
                    return (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
                        style={{
                          borderColor: activeMeta.accentHex,
                          backgroundColor: activeMeta.glowHex,
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-300">
                      Undertema {activeMeta.order} av {KARBON_THEME_LIST.length} •{' '}
                      {activeMeta.dropdownBadge}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                      {activeMeta.title}
                    </h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/35 shrink-0">
                  <Construction className="w-3.5 h-3.5" />
                  <span>Klar for innhold</span>
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeMeta.dropdownDescription}
              </p>

              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-xs sm:text-sm text-slate-400">
                Menyen og strukturen for <strong>{activeMeta.title}</strong> er
                opprettet. Faglig innhold, interaktive modeller, illustrasjoner
                og oppgaver bygges ut steg for steg.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setActiveView(prevTheme ? prevTheme.id : 'karbon')
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>
                    {prevTheme
                      ? `${prevTheme.order}. ${prevTheme.shortTitle}`
                      : 'Karbon-oversikt'}
                  </span>
                </button>

                {nextTheme && (
                  <button
                    type="button"
                    onClick={() => setActiveView(nextTheme.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-xs font-bold text-violet-200 transition-colors cursor-pointer"
                  >
                    <span>
                      {nextTheme.order}. {nextTheme.shortTitle}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </main>
        )
      )}
    </div>
  );
}

export default KarbonModule;
