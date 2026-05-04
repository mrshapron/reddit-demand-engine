export interface KarmaProfile {
  total: number;
  postKarma: number;
  commentKarma: number;
  accountAgeMonths: number;
  trustLevel: 'new' | 'building' | 'trusted' | 'established';
}

export interface WeeklyAction {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: 'comment' | 'post' | 'lurk' | 'karma' | 'avoid';
}

export interface StrategySnapshot {
  bestSubreddits: { name: string; reason: string; score: number }[];
  topPains: { pain: string; mentions: number; subreddits: string[] }[];
  topReplyOpportunities: { id: string; subreddit: string; postTitle: string; leadPotential: number }[];
  postingPlan: { day: string; action: string; subreddit?: string; why: string }[];
  weeklyActions: WeeklyAction[];
  karma: KarmaProfile;
  thingsToAvoid: string[];
  contentThemes: { theme: string; reason: string }[];
}
