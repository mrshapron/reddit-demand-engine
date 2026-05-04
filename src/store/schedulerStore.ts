import { useEffect, useState } from 'react';
import { mockScheduledPosts } from '@/data/mockScheduledPosts';
import type { GeneratedPostDraft, ScheduledPost, ScheduledPostStatus } from '@/types/reddit';

const STORAGE_KEY = 'reddit-demand-engine:scheduled-posts';

export function getScheduledPosts(): ScheduledPost[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockScheduledPosts;
    return JSON.parse(raw) as ScheduledPost[];
  } catch {
    return mockScheduledPosts;
  }
}

export function saveScheduledPosts(posts: ScheduledPost[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event('scheduled-posts-updated'));
}

export function addDraftToSchedule(draft: GeneratedPostDraft, status: ScheduledPostStatus) {
  const current = getScheduledPosts();
  const scheduledFor = nextScheduleSlot(current.length);
  const scheduledPost: ScheduledPost = {
    id: `scheduled-${draft.id}`,
    sourceDraftId: draft.id,
    subreddit: draft.subreddit,
    title: draft.title,
    bodyPreview: draft.body.slice(0, 260),
    postType: draft.postType,
    scheduledFor,
    status,
    spamRisk: draft.spamRisk,
    promotionTolerance: draft.promotionTolerance,
    recommendedCta: draft.recommendedCta,
    safetyNotes: draft.redditNativeRewriteSuggestions,
    businessGoal: draft.whyImportant,
  };

  const exists = current.some((post) => post.sourceDraftId === draft.id);
  const next = exists
    ? current.map((post) =>
        post.sourceDraftId === draft.id
          ? { ...scheduledPost, id: post.id, scheduledFor: post.scheduledFor }
          : post,
      )
    : [scheduledPost, ...current];

  saveScheduledPosts(next);
}

export function useScheduledPosts() {
  const [posts, setPosts] = useState<ScheduledPost[]>(() => getScheduledPosts());

  useEffect(() => {
    const sync = () => setPosts(getScheduledPosts());
    window.addEventListener('storage', sync);
    window.addEventListener('scheduled-posts-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('scheduled-posts-updated', sync);
    };
  }, []);

  return posts;
}

function nextScheduleSlot(queueLength: number) {
  const slots = ['Tomorrow · 10:30 AM', 'Wednesday · 1:00 PM', 'Friday · 2:00 PM', 'Next Monday · 11:00 AM'];
  return slots[queueLength % slots.length];
}
