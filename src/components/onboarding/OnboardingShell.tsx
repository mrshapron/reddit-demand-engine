import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { classNames } from '@/utils/copy';

export interface StepMeta {
  id: string;
  label: string;
  shortLabel?: string;
}

interface Props {
  steps: StepMeta[];
  currentIndex: number;
  children: React.ReactNode;
  onSkip?: () => void;
}

export function OnboardingShell({ steps, currentIndex, children, onSkip }: Props) {
  const total = steps.length;
  const pct = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-slate-100/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/app-icon.png" alt="Enso AI" className="h-8 w-8 object-contain" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Enso AI</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Reddit Demand Engine
              </div>
            </div>
          </Link>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Skip for now
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Stepper steps={steps} currentIndex={currentIndex} pct={pct} />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

function Stepper({
  steps,
  currentIndex,
  pct,
}: {
  steps: StepMeta[];
  currentIndex: number;
  pct: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-3 gap-2 text-[11px] sm:grid-cols-6">
        {steps.map((s, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <li
              key={s.id}
              className={classNames(
                'flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors',
                isCurrent
                  ? 'bg-brand-100 text-brand-800'
                  : isDone
                    ? 'text-slate-800'
                    : 'text-slate-500',
              )}
            >
              <span
                className={classNames(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                  isCurrent
                    ? 'bg-brand-600 text-white'
                    : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-300 text-slate-700',
                )}
              >
                {isDone ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              <span className="truncate font-medium">{s.shortLabel ?? s.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function StepCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-card">
      <div className="border-b border-slate-200 px-7 py-6">
        {eyebrow && (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
        )}
      </div>
      <div className="space-y-5 px-7 py-6">{children}</div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-7 py-4">
        {footer}
      </div>
    </div>
  );
}
