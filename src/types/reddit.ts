export type RecommendedAction =
  | 'lurk_first'
  | 'comment_before_posting'
  | 'safe_for_educational_posts'
  | 'avoid_direct_promotion'
  | 'ready_to_post';

export type PromotionTolerance = 'none' | 'low' | 'medium' | 'high';

export interface SubredditInsight {
  name: string; // e.g. r/SaaS
  description: string;
  members: number;
  whyRelevant: string;
  audienceFit: number; // 0-100
  leadPotential: number; // 0-100
  promotionTolerance: PromotionTolerance;
  spamRisk: number; // 0-100, higher = more risky
  recommendedAction: RecommendedAction;
  commonQuestions: string[];
  repeatedPains: string[];
  competitorMentions: string[];
  customerLanguage: string[];
  contentAngles: string[];
  rules: string[];
  karmaRequirement: 'none' | 'low' | 'medium' | 'high';
}

export type PostIntent =
  | 'asking_recommendation'
  | 'pain_frustration'
  | 'looking_for_alternative'
  | 'asking_how_to_solve';

export type IntentStrength = 'high' | 'medium' | 'low';
export type LevelLabel = 'High' | 'Medium' | 'Low';
export type ProductMention = 'do_not_mention' | 'mention_softly' | 'safe_to_mention';

export interface RedditOpportunity {
  id: string;
  subreddit: string;
  postTitle: string;
  postSnippet: string;
  postUrl: string;
  author: string;
  upvotes: number;
  comments: number;
  postedAt: string; // ISO
  intent: PostIntent;
  intentStrength: IntentStrength;
  leadPotential: number;
  leadPotentialLabel: LevelLabel;
  spamRisk: number;
  spamRiskLabel: LevelLabel;
  whyRelevant: string;
  whyRelevantBullets: string[];
  suggestedReply: string;
  replyStrategy: string;
  shouldMentionProduct: boolean;
  productMention: ProductMention;
  warnings: string[];
  status?: 'pending' | 'applied' | 'skipped' | 'saved';
}

export type GeneratedPostType =
  | 'lessons_learned'
  | 'question'
  | 'case_study'
  | 'checklist'
  | 'research_summary'
  | 'personal_experience';

export interface GeneratedPostDraft {
  id: string;
  subreddit: string;
  subredditDescription: string;
  audienceFit: number;
  leadPotential: number;
  promotionTolerance: PromotionTolerance;
  postType: GeneratedPostType;
  title: string;
  body: string;
  whyImportant: string;
  whyFitsSubreddit: string;
  customerPainTargeted: string;
  recommendedCta: string;
  spamRisk: number;
  redditNativeRewriteSuggestions: string[];
  approved?: boolean;
  warnings: string[];
}
