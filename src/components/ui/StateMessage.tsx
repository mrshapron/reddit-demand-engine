import { AlertTriangle, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-10 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <div className="font-semibold">Something went wrong</div>
        <div className="mt-0.5 text-xs">{error.message}</div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100 p-8 text-center">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mx-auto mt-1 max-w-md text-sm text-slate-600">{body}</div>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
