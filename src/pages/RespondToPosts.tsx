import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { OpportunityCard } from '@/components/respond/OpportunityCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/StateMessage';
import { IngestButton } from '@/components/ui/IngestButton';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';

type Status = 'pending' | 'applied' | 'skipped' | 'saved';
type Sort = 'lead' | 'risk' | 'recent';

export function RespondToPosts() {
  const [sort, setSort] = useState<Sort>('lead');
  const ops = useFetch(() => api.listOpportunities(50), []);

  const onStatusChange = (id: string, status: Status) => {
    void api.setOpportunityStatus(id, status).catch(() => undefined);
  };

  const list = useMemo(() => {
    const data = ops.data ?? [];
    return [...data].sort((a, b) => {
      if (sort === 'lead') return b.leadPotential - a.leadPotential;
      if (sort === 'risk') return a.spamRisk - b.spamRisk;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }, [ops.data, sort]);

  return (
    <StreamLayout
      heading="Reddit opportunities found for you"
      subheading="We scan relevant subreddits and surface high-intent conversations with AI reply suggestions."
      toolbar={
        <>
          <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs">
            <Filter className="ml-1 h-3.5 w-3.5 text-slate-400" />
            {(['lead', 'risk', 'recent'] as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  sort === s ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s === 'lead' ? 'Highest lead' : s === 'risk' ? 'Lowest risk' : 'Most recent'}
              </button>
            ))}
          </div>
          <IngestButton onDone={() => void ops.refetch()} />
        </>
      }
    >
      {ops.loading && <LoadingState label="Loading opportunities…" />}
      {ops.error && <ErrorState error={ops.error} />}
      {!ops.loading && !ops.error && list.length === 0 && (
        <EmptyState
          title="No opportunities yet"
          body="Add some target subreddits on the Listen page and run an ingest. We'll surface high-intent posts and draft suggested replies here."
        />
      )}

      {list.map((op) => (
        <OpportunityCard key={op.id} op={op} onStatusChange={onStatusChange} />
      ))}
    </StreamLayout>
  );
}
