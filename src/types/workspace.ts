export interface WorkspacePlan {
  workspaceName: string;
  workspaceShort: string;
  planName: string;
  resetsInDays: number;
  creditsUsed: number;
  creditsTotal: number;
}

export interface KarmaTrust {
  postKarma: number;
  commentKarma: number;
  subredditEligibility: 'Good' | 'Limited' | 'Restricted';
  status: 'Comment first' | 'Ready to post' | 'Build karma';
}

export interface SpamRiskSummary {
  level: 'Low' | 'Medium' | 'High';
  score: number; // 0-100
  message: string;
}

export interface NextAction {
  title: string;
  progressDone: number;
  progressTotal: number;
  caption: string;
}

export interface CommunityRule {
  text: string;
  ok: boolean;
}

export interface ProTip {
  title: string;
  body: string;
}

export interface BestSubreddit {
  name: string;
  score: number;
}

export interface RightRailData {
  bestSubreddits: BestSubreddit[];
  karma: KarmaTrust;
  spamRisk: SpamRiskSummary;
  nextAction: NextAction;
  communityRules: CommunityRule[];
  proTip: ProTip;
}
