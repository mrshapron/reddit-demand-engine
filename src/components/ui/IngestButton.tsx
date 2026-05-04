import { useEffect, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { api, type IngestStatus } from '@/lib/api';

interface Props {
  onDone?: () => void;
  label?: string;
  size?: 'sm' | 'md';
}

export function IngestButton({ onDone, label = 'Ingest now', size = 'sm' }: Props) {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<IngestStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!running) return;
    const tick = () =>
      api
        .ingestStatus()
        .then((s) => {
          if (cancelled) return;
          setStatus(s);
          if (!s.running) {
            setRunning(false);
            onDone?.();
          }
        })
        .catch(() => undefined);
    tick();
    const interval = setInterval(tick, 2500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [running, onDone]);

  const handleClick = async () => {
    setError(null);
    try {
      await api.startIngest();
      setRunning(true);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'h-8 px-3 text-xs'
      : 'h-9 px-3.5 text-sm';

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={running}
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 font-medium text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses}`}
      >
        {running ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCcw className="h-3.5 w-3.5" />
        )}
        {running ? 'Ingesting…' : label}
      </button>
      {status?.latest && !running && (
        <span className="text-[11px] text-slate-500">
          Last run: {status.latest.posts_fetched} posts ·{' '}
          {status.latest.opportunities_created} opps · {status.latest.llm_calls} LLM calls
        </span>
      )}
      {error && <span className="text-[11px] text-rose-600">{error}</span>}
    </div>
  );
}
