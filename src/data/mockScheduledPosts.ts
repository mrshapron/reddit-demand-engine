import type { ScheduledPost } from '@/types/reddit';

export const mockScheduledPosts: ScheduledPost[] = [
  {
    id: 'scheduled-seed-1',
    sourceDraftId: 'seed-1',
    subreddit: 'r/SaaS',
    title: 'I analyzed common approval workflow complaints in SaaS teams. Here are the patterns.',
    bodyPreview:
      'I kept seeing teams describe the same approval breakdown: requests start in Slack, context is missing, owners are unclear, and nobody knows whether the work is blocked or approved...',
    postType: 'research_summary',
    scheduledFor: 'Tomorrow · 10:30 AM',
    status: 'scheduled',
    spamRisk: 28,
    promotionTolerance: 'medium',
    recommendedCta: 'Ask readers how they currently handle approvals. Do not include a product link.',
    safetyNotes: [
      'Make the post useful without requiring a link.',
      'Disclose affiliation if company context is added.',
      'Reply to comments manually after publishing.',
    ],
    businessGoal: 'Build category authority around approval workflow pain.',
  },
  {
    id: 'scheduled-seed-2',
    sourceDraftId: 'seed-2',
    subreddit: 'r/startups',
    title: 'A practical checklist for getting founder-led onboarding out of your head',
    bodyPreview:
      'This is for the stage where onboarding still works because the founder remembers everything. Before buying tools or hiring ops, capture the trigger, owner, inputs, and handoffs...',
    postType: 'checklist',
    scheduledFor: 'Friday · 2:00 PM',
    status: 'needs_final_review',
    spamRisk: 61,
    promotionTolerance: 'low',
    recommendedCta: 'Invite people to adapt the checklist in comments. No sales CTA.',
    safetyNotes: [
      'Remove language that sounds too polished.',
      'Do not mention workflow automation as the destination.',
      'This subreddit is promotion-sensitive; keep it founder-useful.',
    ],
    businessGoal: 'Earn trust with early founders experiencing onboarding handoff pain.',
  },
];
