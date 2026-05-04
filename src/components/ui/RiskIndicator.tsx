import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { riskColor } from '@/utils/scoring';
import { classNames } from '@/utils/copy';

export function RiskIndicator({
  risk,
  className,
}: {
  risk: number;
  className?: string;
}) {
  const c = riskColor(risk);
  const Icon = risk >= 45 ? AlertTriangle : ShieldCheck;
  return (
    <div
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium',
        c.bg,
        c.border,
        c.text,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>
        {c.label} <span className="tabular-nums opacity-70">· {risk}</span>
      </span>
    </div>
  );
}

export function WarningBanner({
  warnings,
  className,
}: {
  warnings: string[];
  className?: string;
}) {
  if (warnings.length === 0) return null;
  return (
    <div
      className={classNames(
        'rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="space-y-1">
          {warnings.map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
