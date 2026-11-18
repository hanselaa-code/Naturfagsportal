import { ArrowRight, CheckCircle2, Lock, Sparkles, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ModuleProgress } from '../storage';
import { ProgressBar } from './ProgressBar';

export interface TopicCardConfig {
  id: ModuleProgress['moduleId'];
  emneNumber: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  route?: string;
  available: boolean;
  accentColor: 'amber' | 'emerald' | 'cyan' | 'violet' | 'rose';
  icon: LucideIcon;
  imageUrl?: string;
  subtopics: string[];
  competenceGoalsCount: number;
}

interface TopicCardProps {
  topic: TopicCardConfig;
  progress: ModuleProgress;
  onSelect?: (route: string) => void;
}

const ACCENT_STYLES: Record<
  TopicCardConfig['accentColor'],
  {
    badge: string;
    iconBox: string;
    borderHover: string;
    button: string;
    glow: string;
  }
> = {
  amber: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    iconBox: 'bg-amber-500/15 text-amber-400 ring-amber-400/30',
    borderHover: 'hover:border-amber-400/45',
    button:
      'bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border-amber-400/30',
    glow: 'group-hover:shadow-amber-500/10',
  },
  emerald: {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    iconBox: 'bg-emerald-500/15 text-emerald-400 ring-emerald-400/30',
    borderHover: 'hover:border-emerald-400/45',
    button:
      'bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 border-emerald-400/30',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  cyan: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    iconBox: 'bg-sky-500/15 text-sky-400 ring-sky-400/30',
    borderHover: 'hover:border-sky-400/45',
    button:
      'bg-sky-500/15 text-sky-200 hover:bg-sky-500/25 border-sky-400/30',
    glow: 'group-hover:shadow-sky-500/10',
  },
  violet: {
    badge: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
    iconBox: 'bg-violet-500/15 text-violet-400 ring-violet-400/30',
    borderHover: 'hover:border-violet-400/30',
    button:
      'bg-violet-500/10 text-violet-300 border-violet-400/20',
    glow: '',
  },
  rose: {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    iconBox: 'bg-rose-500/15 text-rose-400 ring-rose-400/30',
    borderHover: 'hover:border-rose-400/30',
    button: 'bg-rose-500/10 text-rose-300 border-rose-400/20',
    glow: '',
  },
};

export function TopicCard({ topic, progress, onSelect }: TopicCardProps) {
  const Icon = topic.icon;
  const styles = ACCENT_STYLES[topic.accentColor];
  const completedCount = progress.completedSubchapters.length;
  const totalCount = progress.totalSubchapters;

  const quizEntries = Object.values(progress.quizScores);
  const avgQuiz =
    quizEntries.length > 0
      ? Math.round(
          quizEntries.reduce((sum, q) => sum + q.percentage, 0) /
            quizEntries.length,
        )
      : null;

  return (
    <div
      onClick={() => {
        if (topic.available && topic.route && onSelect) {
          onSelect(topic.route);
        }
      }}
      role={topic.available ? 'button' : undefined}
      tabIndex={topic.available ? 0 : undefined}
      onKeyDown={(e) => {
        if (
          topic.available &&
          topic.route &&
          onSelect &&
          (e.key === 'Enter' || e.key === ' ')
        ) {
          e.preventDefault();
          onSelect(topic.route);
        }
      }}
      className={`group glass-panel relative flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 ${
        topic.available
          ? `cursor-pointer ${styles.borderHover} hover:-translate-y-1 hover:shadow-2xl ${styles.glow}`
          : 'opacity-75 cursor-not-allowed border-slate-700/40'
      }`}
    >
      {topic.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-slate-800/80 bg-slate-950">
          <img
            src={topic.imageUrl}
            alt={topic.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1222] via-transparent to-black/20" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase backdrop-blur-md ${styles.badge}`}
            >
              Emne {topic.emneNumber} • {topic.code}
            </span>
          </div>
          {!topic.available && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-md">
              <Lock className="h-3 w-3" />
              Kommer
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Header row */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${styles.iconBox}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                {!topic.imageUrl && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${styles.badge}`}
                  >
                    Emne {topic.emneNumber} • {topic.code}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-slate-50">
                  {topic.title}
                </h3>
              </div>
            </div>

            {!topic.imageUrl && !topic.available && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                <Lock className="h-3 w-3" />
                Kommer
              </span>
            )}
          </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-300/90">
          {topic.description}
        </p>

        {/* Subtopics preview */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {topic.subtopics.map((sub) => (
            <span
              key={sub}
              className="rounded-lg bg-slate-800/75 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/5"
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Progress & CTA */}
      <div className="space-y-4 border-t border-slate-800/80 pt-4">
        {topic.available ? (
          <>
            <ProgressBar
              value={completedCount}
              max={totalCount}
              label={`${completedCount} av ${totalCount} delkapitler utforsket`}
              accentColor={topic.accentColor}
              size="sm"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {avgQuiz !== null ? (
                  <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                    <Trophy className="h-3.5 w-3.5" />
                    Snitt quiz: {avgQuiz}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                    {topic.competenceGoalsCount} kompetansemål
                  </span>
                )}
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors ${styles.button}`}
              >
                Åpne modul
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-slate-500" />
              Under utvikling for NAT01-05
            </span>
            <span className="font-medium text-slate-500">Planlagt</span>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
