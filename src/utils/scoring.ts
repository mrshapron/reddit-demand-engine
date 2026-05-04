import type { PromotionTolerance } from '@/types/reddit';

export function scoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  if (score >= 80) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-brand-700',
      bg: 'bg-brand-50',
      border: 'border-brand-200',
      dot: 'bg-brand-500',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    };
  }
  return {
    text: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  };
}

export function riskColor(risk: number): {
  text: string;
  bg: string;
  border: string;
  label: string;
} {
  if (risk >= 70) {
    return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', label: 'High risk' };
  }
  if (risk >= 45) {
    return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Medium risk' };
  }
  if (risk >= 25) {
    return { text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', label: 'Low risk' };
  }
  return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Minimal risk' };
}

export function tolerationLabel(tol: PromotionTolerance): string {
  switch (tol) {
    case 'none':
      return 'No promotion';
    case 'low':
      return 'Promo: low';
    case 'medium':
      return 'Promo: medium';
    case 'high':
      return 'Promo: ok';
  }
}

export function actionLabel(action: string): { label: string; tone: 'good' | 'caution' | 'warn' | 'neutral' } {
  switch (action) {
    case 'lurk_first':
      return { label: 'Lurk first', tone: 'caution' };
    case 'comment_before_posting':
      return { label: 'Comment before posting', tone: 'caution' };
    case 'safe_for_educational_posts':
      return { label: 'Safe for educational posts', tone: 'good' };
    case 'avoid_direct_promotion':
      return { label: 'Avoid direct promotion', tone: 'warn' };
    case 'ready_to_post':
      return { label: 'Ready to post', tone: 'good' };
    default:
      return { label: action, tone: 'neutral' };
  }
}

export function intentLabel(intent: string): string {
  switch (intent) {
    case 'asking_recommendation':
      return 'Asking for recommendation';
    case 'pain_frustration':
      return 'Pain / frustration';
    case 'looking_for_alternative':
      return 'Looking for alternative';
    case 'asking_how_to_solve':
      return 'Asking how to solve';
    default:
      return intent;
  }
}

export function postTypeLabel(t: string): string {
  switch (t) {
    case 'lessons_learned':
      return 'Lessons learned';
    case 'question':
      return 'Question';
    case 'case_study':
      return 'Case study';
    case 'checklist':
      return 'Checklist';
    case 'research_summary':
      return 'Research summary';
    case 'personal_experience':
      return 'Personal experience';
    default:
      return t;
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

export function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
