import { useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { SubredditCard } from '@/components/listen/SubredditCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/StateMessage';
import { IngestButton } from '@/components/ui/IngestButton';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';

type Sort = 'fit' | 'lead' | 'risk';

export function Listen() {
  const [sort, setSort] = useState<Sort>('fit');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  const subs = useFetch(() => api.listSubreddits(), []);
  const sorted = useMemo(() => {
    const list = subs.data ?? [];
    return [...list].sort((a, b) => {
      if (sort === 'fit') return b.audienceFit - a.audienceFit;
      if (sort === 'lead') return b.leadPotential - a.leadPotential;
      return a.spamRisk - b.spamRisk;
    });
  }, [subs.data, sort]);

  const handleAdd = async () => {
    setAddError(null);
    const name = newName.trim();
    if (!name) return;
    try {
      await api.addSubreddit(name);
      setNewName('');
      setAdding(false);
      await subs.refetch();
    } catch (e) {
      setAddError((e as Error).message);
    }
  };

  return (
    <StreamLayout
      heading="Subreddits worth listening to"
      subheading="We rank communities by audience fit, lead potential, and how friendly they are to non-promotional contributions."
      toolbar={
        <>
          <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs">
            <Filter className="ml-1 h-3.5 w-3.5 text-slate-400" />
            {(['fit', 'lead', 'risk'] as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  sort === s ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s === 'fit' ? 'Audience fit' : s === 'lead' ? 'Lead potential' : 'Lowest risk'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAdding((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add subreddit
          </button>
          <IngestButton onDone={() => void subs.refetch()} />
        </>
      }
    >
      {adding && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-100 p-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. r/SaaS or RevOps"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <button
              onClick={handleAdd}
              className="inline-flex h-8 items-center rounded-md bg-brand-600 px-3 text-xs font-medium text-white hover:bg-brand-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setAddError(null);
              }}
              className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
          {addError && <p className="mt-2 text-xs text-rose-600">{addError}</p>}
          <p className="mt-2 text-[11px] text-slate-500">
            We pull metadata from Reddit and start watching it on the next ingest run.
          </p>
        </div>
      )}

      {subs.loading && <LoadingState label="Loading subreddits…" />}
      {subs.error && <ErrorState error={subs.error} />}
      {!subs.loading && !subs.error && sorted.length === 0 && (
        <EmptyState
          title="No subreddits analyzed yet"
          body='Add a subreddit above and click "Ingest now" — we will scrape its recent posts, score them against your company profile, and surface the insight here.'
        />
      )}

      {sorted.map((s) => (
        <SubredditCard key={s.name} sr={s} />
      ))}
    </StreamLayout>
  );
}
