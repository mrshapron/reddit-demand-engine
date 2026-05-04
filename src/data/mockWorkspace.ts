import type { WorkspacePlan, RightRailData } from '@/types/workspace';

export const mockWorkspace: WorkspacePlan = {
  workspaceName: 'Acme Co.',
  workspaceShort: 'AC',
  planName: 'Pro Plan',
  resetsInDays: 14,
  creditsUsed: 280,
  creditsTotal: 1000,
};

export const mockRightRail: RightRailData = {
  bestSubreddits: [
    { name: 'r/SaaS', score: 92 },
    { name: 'r/operations', score: 88 },
    { name: 'r/revops', score: 85 },
    { name: 'r/startups', score: 72 },
  ],
  karma: {
    postKarma: 420,
    commentKarma: 1260,
    subredditEligibility: 'Good',
    status: 'Comment first',
  },
  spamRisk: {
    level: 'Low',
    score: 18,
    message: 'Your content looks helpful and community-focused. Keep it up.',
  },
  nextAction: {
    title: 'Reply to 3 high-intent posts before publishing your first post.',
    progressDone: 0,
    progressTotal: 3,
    caption: "You've replied to 0 high-intent posts.",
  },
  communityRules: [
    { text: 'Avoid direct promotion', ok: true },
    { text: 'Be useful and human', ok: true },
    { text: 'Comment before posting', ok: true },
  ],
  proTip: {
    title: 'Pro tip',
    body: 'The best results come from listening first, adding value, and building trust.',
  },
};
