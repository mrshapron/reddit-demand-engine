import { type HTMLAttributes } from 'react';
import { classNames } from '@/utils/copy';

type Tone = 'neutral' | 'good' | 'caution' | 'warn' | 'brand' | 'info';

const TONES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  caution: 'bg-amber-50 text-amber-700 border-amber-200',
  warn: 'bg-rose-50 text-rose-700 border-rose-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
