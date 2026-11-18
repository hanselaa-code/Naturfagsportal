import {
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import type { KarbonStepNode } from '../data/atomBindingData';

interface KarbonInfoPanelProps {
  node: KarbonStepNode;
  totalSteps: number;
  onOpenLightbox: (node: KarbonStepNode) => void;
}

export function KarbonInfoPanel({
  node,
  totalSteps,
  onOpenLightbox,
}: KarbonInfoPanelProps) {
  return (
    <aside className="h-full flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/75 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
        {/* Header & Hero Image */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-200 border border-violet-400/35">
              <span>{node.badgeText}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Steg {node.stepNumber} / {totalSteps}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight">
            {node.title}
          </h2>

          <button
            type="button"
            onClick={() => onOpenLightbox(node)}
            className="group relative w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 cursor-zoom-in block text-left"
          >
            <img
              src={node.image}
              alt={node.title}
              loading="lazy"
              className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-700 text-[10px] font-semibold text-slate-200 opacity-85 group-hover:opacity-100">
              <ZoomIn className="w-3 h-3 text-violet-300" />
              <span>Forstørr</span>
            </div>
            <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-300 leading-snug">
              {node.imageCaption}
            </div>
          </button>
        </div>

        {/* Main explanation */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-violet-300">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{node.summaryTitle}</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {node.whatHappens}
          </p>
        </div>

        {/* Key traits */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Viktige begreper &amp; mekanismer
          </div>
          <div className="space-y-2">
            {node.keyTraits.map((trait) => (
              <div
                key={trait.title}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {trait.title}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {trait.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classroom / Self-study prompt */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Prøv selv i laben</span>
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            {node.classroomTest}
          </p>
        </div>

        {/* Did you know */}
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visste du at?</span>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {node.didYouKnow}
          </p>
        </div>

        {/* Examples pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {node.examples.map((ex) => (
            <span
              key={ex}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800/90 text-slate-200 border border-slate-700"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
