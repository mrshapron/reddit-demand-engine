import { useMemo, useState } from 'react';
import { Filter, RefreshCcw } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { GeneratedPostCard } from '@/components/generate/GeneratedPostCard';
import { mockGeneratedPosts } from '@/data/mockGeneratedPosts';
import { postTypeLabel } from '@/utils/scoring';
import type { GeneratedPostType } from '@/types/reddit';

const FILTER_TYPES: ReadonlyArray<'all' | GeneratedPostType> = [
  'all',
  'lessons_learned',
  'research_summary',
  'checklist',
  'question',
  'case_study',
  'personal_experience',
];

export function GeneratePosts() {
  const [type, setType] = useState<'all' | GeneratedPostType>('all');

  const drafts = useMemo(() => {
    return type === 'all'
      ? mockGeneratedPosts
      : mockGeneratedPosts.filter((d) => d.postType === type);
  }, [type]);

  return (
    <StreamLayout
      heading="Original posts — only when it makes sense"
      subheading={'We prefer Reddit-native formats: lessons, research summaries, checklists. We never generate "check out my product" posts.'}
      toolbar={
        <>
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs">
            <Filter className="ml-1 h-3.5 w-3.5 text-slate-400" />
            {FILTER_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  type === t ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t === 'all' ? 'All' : postTypeLabel(t)}
              </button>
            ))}
          </div>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-50">
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
        </>
      }
    >
      {drafts.map((d) => (
        <GeneratedPostCard key={d.id} draft={d} />
      ))}
    </StreamLayout>
  );
}
