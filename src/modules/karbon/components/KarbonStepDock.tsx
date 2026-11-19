import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import type { KarbonStepNode } from '../data/atomBindingData';

interface KarbonStepDockProps {
  steps: KarbonStepNode[];
  currentStepIndex: number;
  unlockedStepIndex: number;
  showAllSteps: boolean;
  isFullscreen?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onJumpToStep: (idx: number) => void;
}

export function KarbonStepDock({
  steps,
  currentStepIndex,
  unlockedStepIndex,
  showAllSteps,
  isFullscreen = false,
  onPrev,
  onNext,
  onJumpToStep,
}: KarbonStepDockProps) {
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  return (
    <footer
      className={`fixed lg:static bottom-0 left-0 right-0 z-20 border-t border-slate-800/80 bg-[#090E1A]/95 backdrop-blur-md ${
        isFullscreen ? 'px-2.5 sm:px-3.5 py-1.5' : 'px-3 sm:px-6 py-2.5'
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-2 sm:gap-4 ${
          isFullscreen ? 'w-full' : 'max-w-[1920px]'
        }`}
      >
        <button
          id="btn-karbon-prev"
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`inline-flex items-center gap-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer shrink-0 ${
            isFullscreen ? 'py-1.5' : 'py-2'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Forrige</span>
        </button>

        {/* Step pills */}
        <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto py-0.5">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isUnlocked = showAllSteps || idx <= unlockedStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onJumpToStep(idx)}
                title={`${step.stepNumber}. ${step.title}`}
                className={`inline-flex items-center gap-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                  isFullscreen ? 'py-1' : 'py-1.5'
                } ${
                  isCurrent
                    ? 'bg-violet-500 text-slate-950 border-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.45)]'
                    : isUnlocked
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                      : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <span className="font-mono">{step.stepNumber}</span>
                <span className="hidden xl:inline max-w-[120px] truncate">
                  {step.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        <button
          id="btn-karbon-next"
          type="button"
          onClick={onNext}
          className={`inline-flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            isFullscreen ? 'py-1.5' : 'py-2'
          } ${
            isLast
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
              : 'bg-violet-500 hover:bg-violet-400 text-slate-950 border-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.35)]'
          }`}
        >
          {isLast ? (
            <>
              <HelpCircle className="w-4 h-4" />
              <span>Kontrollspørsmål</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Neste steg</span>
              <span className="sm:hidden">Neste</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
