import { scoreColor } from '@/utils/scoring';
import { classNames } from '@/utils/copy';

interface ScoreBadgeProps {
  label: string;
  score: number;
  className?: string;
  compact?: boolean;
}

export function ScoreBadge({ label, score, className, compact }: ScoreBadgeProps) {
  const c = scoreColor(score);
  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 rounded-lg border px-2.5 py-1',
        c.bg,
        c.border,
        className,
      )}
    >
      {!compact && (
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
      )}
      <span className={classNames('text-sm font-semibold tabular-nums', c.text)}>
        {score}
      </span>
      {compact && (
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      )}
    </div>
  );
}

export function ScoreBar({ score, className }: { score: number; className?: string }) {
  const c = scoreColor(score);
  return (
    <div className={classNames('h-1.5 w-full rounded-full bg-slate-100', className)}>
      <div
        className={classNames('h-1.5 rounded-full', c.dot)}
        style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
      />
    </div>
  );
}
