import { useMemo, useState } from 'react';
import { Filter, Loader2, Sparkles } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { GeneratedPostCard } from '@/components/generate/GeneratedPostCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/StateMessage';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';
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
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [selectedType, setSelectedType] = useState<GeneratedPostType>('lessons_learned');

  const drafts = useFetch(() => api.listDrafts(), []);
  const insights = useFetch(() => api.listSubreddits(), []);

  const subList = insights.data ?? [];
  const filtered = useMemo(() => {
    const list = drafts.data ?? [];
    return type === 'all' ? list : list.filter((d) => d.postType === type);
  }, [drafts.data, type]);

  const handleGenerate = async () => {
    setError(null);
    if (!selectedSub) {
      setError('Pick a subreddit first.');
      return;
    }
    setGenerating(true);
    try {
      await api.generateDraft(selectedSub, selectedType);
      await drafts.refetch();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

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
        </>
      }
    >
      <div className="mb-5 rounded-xl border border-slate-200 bg-slate-100 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Sparkles className="h-4 w-4 text-brand-600" /> Generate a new draft
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Pick one of your analyzed subreddits and a post format. We'll draft something Reddit-native using your company profile + the latest community insight.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="h-9 min-w-[180px] rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-800"
          >
            <option value="">Select subreddit…</option>
            {subList.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as GeneratedPostType)}
            className="h-9 min-w-[180px] rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-800"
          >
            {FILTER_TYPES.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t}>
                {postTypeLabel(t as GeneratedPostType)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {generating ? 'Drafting…' : 'Generate draft'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      </div>

      {drafts.loading && <LoadingState label="Loading drafts…" />}
      {drafts.error && <ErrorState error={drafts.error} />}
      {!drafts.loading && !drafts.error && filtered.length === 0 && (
        <EmptyState
          title="No drafts yet"
          body="Pick a subreddit + format above and generate your first draft."
        />
      )}

      {filtered.map((d) => (
        <GeneratedPostCard key={d.id} draft={d} />
      ))}
    </StreamLayout>
  );
}
