import { useMemo, useState } from 'react';
import { Filter, RefreshCcw } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { OpportunityCard } from '@/components/respond/OpportunityCard';
import { mockRedditOpportunities } from '@/data/mockRedditPosts';
import type { RedditOpportunity } from '@/types/reddit';

type Status = 'pending' | 'applied' | 'skipped' | 'saved';
type Sort = 'lead' | 'risk' | 'recent';

export function RespondToPosts() {
  const [sort, setSort] = useState<Sort>('lead');
  const [, setStatuses] = useState<Record<string, Status>>({});

  const onStatusChange = (id: string, status: Status) =>
    setStatuses((m) => ({ ...m, [id]: status }));

  const list = useMemo(() => {
    const l: RedditOpportunity[] = [...mockRedditOpportunities];
    return l.sort((a, b) => {
      if (sort === 'lead') return b.leadPotential - a.leadPotential;
      if (sort === 'risk') return a.spamRisk - b.spamRisk;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }, [sort]);

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
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-50">
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
        </>
      }
    >
      {list.map((op) => (
        <OpportunityCard key={op.id} op={op} onStatusChange={onStatusChange} />
      ))}
    </StreamLayout>
  );
}
