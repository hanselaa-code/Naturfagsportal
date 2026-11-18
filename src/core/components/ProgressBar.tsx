interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  accentColor?: 'amber' | 'emerald' | 'cyan' | 'violet' | 'rose';
  size?: 'sm' | 'md';
  showPercentage?: boolean;
}

const ACCENT_CLASSES: Record<
  NonNullable<ProgressBarProps['accentColor']>,
  string
> = {
  amber: 'from-amber-400 to-orange-500 shadow-amber-500/30',
  emerald: 'from-emerald-400 to-teal-500 shadow-emerald-500/30',
  cyan: 'from-sky-400 to-cyan-500 shadow-sky-500/30',
  violet: 'from-violet-400 to-purple-500 shadow-violet-500/30',
  rose: 'from-rose-400 to-pink-500 shadow-rose-500/30',
};

export function ProgressBar({
  value,
  max,
  label,
  accentColor = 'cyan',
  size = 'md',
  showPercentage = true,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.max(0, Math.min(safeMax, value));
  const percentage = Math.round((clamped / safeMax) * 100);
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label ? (
            <span className="font-medium text-slate-300">{label}</span>
          ) : (
            <span />
          )}
          {showPercentage && (
            <span className="font-mono-time font-semibold text-slate-200">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-white/5 ${heightClass}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r shadow-sm transition-all duration-500 ease-out ${ACCENT_CLASSES[accentColor]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
