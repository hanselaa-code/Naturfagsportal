import {
  AlertCircle,
  Award,
  CheckCircle2,
  MinusCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  formatNorwegianDateTime,
  getGradingScaleShortLabel,
  type AiAssessment,
} from '../types';

interface AiFeedbackCardProps {
  assessment: AiAssessment;
  teacherGradeOverride?: string;
  teacherNote?: string;
  compact?: boolean;
}

export function getGradeBadgeStyle(
  gradeLabel: string,
  numericScore: number,
): string {
  const lower = gradeLabel.toLowerCase();
  if (lower.includes('ikke bestått') || lower.includes('lav')) {
    return 'border-rose-400/40 bg-rose-500/15 text-rose-200';
  }
  if (lower.includes('bestått') || lower.includes('høy') || numericScore >= 75) {
    return 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200';
  }
  if (lower.includes('middels') || numericScore >= 50) {
    return 'border-amber-400/40 bg-amber-500/15 text-amber-200';
  }
  return 'border-rose-400/40 bg-rose-500/15 text-rose-200';
}

export function AiFeedbackCard({
  assessment,
  teacherGradeOverride,
  teacherNote,
  compact = false,
}: AiFeedbackCardProps) {
  const displayedGrade = teacherGradeOverride?.trim() || assessment.gradeLabel;

  return (
    <div className="rounded-2xl border border-sky-400/25 bg-slate-900/80 p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-sm font-bold text-white">
                AI-sensor vurdering
              </h4>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                {getGradingScaleShortLabel(assessment.gradingScale)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Vurdert {formatNorwegianDateTime(assessment.evaluatedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-bold ${getGradeBadgeStyle(
              displayedGrade,
              assessment.numericScore,
            )}`}
          >
            <Award className="h-4 w-4" />
            <span>{displayedGrade}</span>
          </div>
          {teacherGradeOverride?.trim() && (
            <span className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-2 py-1 text-[11px] font-medium text-violet-200">
              Overstyrt av lærer (AI: {assessment.gradeLabel})
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Helhetsvurdering
        </p>
        <p className="text-sm leading-relaxed text-slate-200">
          {assessment.summary}
        </p>
      </div>

      {/* Strengths & Improvements */}
      {!compact && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Styrker i besvarelsen
            </p>
            <ul className="space-y-1.5 text-sm text-slate-200">
              {assessment.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <TrendingUp className="h-4 w-4" />
              Forbedringspunkter
            </p>
            <ul className="space-y-1.5 text-sm text-slate-200">
              {assessment.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Criteria breakdown */}
      {!compact && assessment.criteriaBreakdown.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Vurdering opp mot kriteriene
          </p>
          <div className="space-y-2">
            {assessment.criteriaBreakdown.map((item, idx) => {
              const Icon =
                item.status === 'oppnadd'
                  ? CheckCircle2
                  : item.status === 'delvis'
                    ? MinusCircle
                    : AlertCircle;
              const colorClass =
                item.status === 'oppnadd'
                  ? 'text-emerald-400'
                  : item.status === 'delvis'
                    ? 'text-amber-400'
                    : 'text-rose-400';
              const badgeText =
                item.status === 'oppnadd'
                  ? 'Oppnådd'
                  : item.status === 'delvis'
                    ? 'Delvis oppnådd'
                    : 'Mangler';

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                      <Icon className={`h-4 w-4 shrink-0 ${colorClass}`} />
                      {item.criterion}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${colorClass}`}
                    >
                      {badgeText}
                    </span>
                  </div>
                  <p className="pl-6 text-xs leading-relaxed text-slate-300">
                    {item.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Teacher note */}
      {teacherNote?.trim() && (
        <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
            Kommentar fra lærer
          </p>
          <p className="text-sm text-slate-200">{teacherNote}</p>
        </div>
      )}
    </div>
  );
}
