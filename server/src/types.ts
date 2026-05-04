// Mirrors src/types/reddit.ts and src/types/company.ts on the frontend.
// Keep these in sync.

export type RecommendedAction =
  | 'lurk_first'
  | 'comment_before_posting'
  | 'safe_for_educational_posts'
  | 'avoid_direct_promotion'
  | 'ready_to_post';

export type PromotionTolerance = 'none' | 'low' | 'medium' | 'high';

export interface SubredditInsight {
  name: string;
  description: string;
  members: number;
  whyRelevant: string;
  audienceFit: number;
  leadPotential: number;
  promotionTolerance: PromotionTolerance;
  spamRisk: number;
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
  postedAt: string;
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

export interface CompanyProfile {
  companyName: string;
  website: string;
  description: string;
  productsServices: string;
  productToPromote: string;
  idealCustomerProfile: string;
  targetCustomerRoles: string;
  customerPains: string;
  problemSolved: string;
  competitors: string;
  toneOfVoice: string;
  positioning: string;
  thingsToAvoid: string;
  proofPoints: string;
  ctaPreference: string;
  targetMarkets: string;
  valueProposition: string;
  exampleUseCases: string;
}

export const EMPTY_PROFILE: CompanyProfile = {
  companyName: '',
  website: '',
  description: '',
  productsServices: '',
  productToPromote: '',
  idealCustomerProfile: '',
  targetCustomerRoles: '',
  customerPains: '',
  problemSolved: '',
  competitors: '',
  toneOfVoice: '',
  positioning: '',
  thingsToAvoid: '',
  proofPoints: '',
  ctaPreference: '',
  targetMarkets: '',
  valueProposition: '',
  exampleUseCases: '',
};

export interface RawRedditPost {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
}
