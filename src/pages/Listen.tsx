import { useMemo, useState } from 'react';
import { Filter, RefreshCcw } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { SubredditCard } from '@/components/listen/SubredditCard';
import { mockSubreddits } from '@/data/mockSubreddits';

type Sort = 'fit' | 'lead' | 'risk';

export function Listen() {
  const [sort, setSort] = useState<Sort>('fit');

  const subs = useMemo(() => {
    return [...mockSubreddits].sort((a, b) => {
      if (sort === 'fit') return b.audienceFit - a.audienceFit;
      if (sort === 'lead') return b.leadPotential - a.leadPotential;
      return a.spamRisk - b.spamRisk;
    });
  }, [sort]);

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
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-50">
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
        </>
      }
    >
      {subs.map((s) => (
        <SubredditCard key={s.name} sr={s} />
      ))}
    </StreamLayout>
  );
}
