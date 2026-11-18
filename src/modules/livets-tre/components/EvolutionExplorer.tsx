import { CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { EVOLUTION_NODES } from '../data/evolutionData';

interface EvolutionExplorerProps {
  unlockedStepIndex: number;
  showAllSteps: boolean;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

const ACCENT_RING: Record<string, string> = {
  origin: '#10B981',
  microbe: '#38BDF8',
  plant_fungi: '#34D399',
  invertebrate: '#A78BFA',
  vertebrate: '#F59E0B',
  mammal: '#FB7185',
  human: '#2DD4BF',
};

export function EvolutionExplorer({
  unlockedStepIndex,
  showAllSteps,
  selectedNodeId,
  onSelectNode,
}: EvolutionExplorerProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl glass-panel border border-slate-800/80 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Hva er evolusjon? • 8 steg
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Klikk på et steg for å utforske mekanismer, eksempler og bevis
        </span>
      </div>

      {/* Responsive card-grid stage */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {EVOLUTION_NODES.map((node) => {
            const isUnlocked = showAllSteps || node.stepIndex <= unlockedStepIndex;
            const isSelected = node.id === selectedNodeId;
            const accent = ACCENT_RING[node.accentCategory] ?? '#10B981';

            return (
              <button
                key={node.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onSelectNode(node.id)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
                  !isUnlocked
                    ? 'opacity-45 cursor-not-allowed border-slate-800/80 bg-slate-900/40'
                    : isSelected
                      ? 'cursor-pointer border-emerald-400/75 bg-emerald-500/12 shadow-[0_0_24px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/40'
                      : 'cursor-pointer border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-800/75'
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800/80">
                  <img
                    src={node.image}
                    alt={node.title}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-500 ${
                      isUnlocked ? 'group-hover:scale-105' : 'grayscale'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/25" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      style={{ borderColor: accent }}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-950/90 border text-[11px] font-mono-time font-bold text-white"
                    >
                      {node.stepNumber}
                    </span>
                    <span className="rounded-full bg-slate-950/85 border border-slate-700/80 px-2 py-0.5 text-[10px] font-semibold text-slate-200 backdrop-blur-sm">
                      {node.eraLabel}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {!isUnlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-800">
                        <Lock className="w-3 h-3" />
                        Låst
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 border border-emerald-400/50">
                        <CheckCircle2 className="w-3 h-3" />
                        Valgt
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="font-display text-sm font-bold text-white leading-snug">
                    {node.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {node.summaryTitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
