import { useState } from 'react';
import {
  ArrowBigUp,
  ExternalLink,
  Pencil,
  X,
  Bookmark,
  MoreVertical,
  Sparkles,
  Check,
  Flame,
  AlertTriangle,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
  RedditOpportunity,
  PostIntent,
  IntentStrength,
  LevelLabel,
  ProductMention,
} from '@/types/reddit';
import { timeAgo, formatNumber } from '@/utils/scoring';
import { copyToClipboard, REDDIT_LINK_PROPS, subredditUrl } from '@/lib/reddit';

type Status = 'pending' | 'applied' | 'skipped' | 'saved';

interface OpportunityCardProps {
  op: RedditOpportunity;
  onStatusChange?: (id: string, status: Status) => void;
}

const INTENT_LABEL: Record<PostIntent, string> = {
  asking_recommendation: 'Asking for recommendation',
  pain_frustration: 'Pain / frustration',
  looking_for_alternative: 'Looking for alternative',
  asking_how_to_solve: 'Asking how to solve',
};

const INTENT_TONE: Record<PostIntent, { bg: string; text: string }> = {
  asking_recommendation: { bg: 'bg-brand-50', text: 'text-brand-700' },
  pain_frustration: { bg: 'bg-amber-50', text: 'text-amber-700' },
  looking_for_alternative: { bg: 'bg-violet-50', text: 'text-violet-700' },
  asking_how_to_solve: { bg: 'bg-sky-50', text: 'text-sky-700' },
};

const LEVEL_TONE: Record<LevelLabel, string> = {
  High: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-slate-50 text-slate-700 border-slate-200',
};

const RISK_TONE: Record<LevelLabel, string> = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STRENGTH_LABEL: Record<IntentStrength, string> = {
  high: 'High intent',
  medium: 'Medium intent',
  low: 'Low intent',
};

const STRENGTH_TONE: Record<IntentStrength, string> = {
  high: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-50 text-slate-600',
};

const MENTION_LABEL: Record<ProductMention, { label: string; tone: string; icon: React.ComponentType<{ className?: string }> }> = {
  do_not_mention: {
    label: 'Do not mention product yet',
    tone: 'text-amber-700',
    icon: Ban,
  },
  mention_softly: {
    label: 'Safe to mention product softly',
    tone: 'text-emerald-700',
    icon: Check,
  },
  safe_to_mention: {
    label: 'Safe to mention product',
    tone: 'text-emerald-700',
    icon: Check,
  },
};

export function OpportunityCard({ op, onStatusChange }: OpportunityCardProps) {
  const [reply, setReply] = useState(op.suggestedReply);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<Status>(op.status ?? 'pending');
  const [copied, setCopied] = useState(false);

  const setS = (s: Status) => {
    setStatus(s);
    onStatusChange?.(op.id, s);
  };

  const handleOpenAndCopy = async () => {
    const ok = await copyToClipboard(reply);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    window.open(op.postUrl, '_blank', 'noopener,noreferrer');
    setS('applied');
  };

  const intentTone = INTENT_TONE[op.intent] ?? INTENT_TONE.asking_recommendation;
  const Mention = MENTION_LABEL[op.productMention] ?? MENTION_LABEL.do_not_mention;
  const bullets = op.whyRelevantBullets ?? [];
  const warnings = op.warnings ?? [];
  const leadLabel = (op.leadPotentialLabel ?? 'Low') as LevelLabel;
  const spamLabel = (op.spamRiskLabel ?? 'Low') as LevelLabel;
  const strength = op.intentStrength ?? 'low';

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 shadow-card">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_minmax(280px,1.4fr)]">
        {/* Column 1 — post info */}
        <div className="min-w-0 border-b border-slate-100 px-4 pb-4 pt-4 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
              r/
            </div>
            <a
              href={subredditUrl(op.subreddit)}
              {...REDDIT_LINK_PROPS}
              className="font-semibold text-slate-900 hover:text-brand-700 hover:underline"
            >
              {op.subreddit}
            </a>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">{timeAgo(op.postedAt)}</span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-0.5 text-slate-500">
              <ArrowBigUp className="h-3 w-3 text-orange-500" /> {formatNumber(op.upvotes)} upvotes
            </span>
          </div>
          <a
            href={op.postUrl}
            {...REDDIT_LINK_PROPS}
            className="mt-2 block text-[15px] font-semibold leading-snug text-slate-900 hover:text-brand-700 hover:underline"
          >
            {op.postTitle}
            <ExternalLink className="ml-1 inline h-3.5 w-3.5 -translate-y-0.5 text-slate-400" />
          </a>
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-slate-600">{op.postSnippet}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${intentTone.bg} ${intentTone.text}`}>
              {INTENT_LABEL[op.intent]}
            </span>
            <a
              href={op.postUrl}
              {...REDDIT_LINK_PROPS}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
            >
              <ExternalLink className="h-3 w-3" /> View on Reddit
            </a>
          </div>
        </div>

        {/* Column 2 — Why this is relevant */}
        <div className="min-w-0 border-b border-slate-100 px-4 pb-4 pt-4 md:border-b-0 md:border-r">
          <div className="text-[12px] font-semibold text-slate-900">Why this is relevant</div>
          <ul className="mt-2 space-y-1.5 text-[13px]">
            {bullets.length > 0 ? (
              bullets.map((b, i) => (
                <li key={`${b}-${i}`} className="flex items-start gap-2 text-slate-700">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span>{b}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-600">{op.whyRelevant}</li>
            )}
          </ul>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${STRENGTH_TONE[strength]}`}>
              <Flame className="h-3 w-3" />
              {STRENGTH_LABEL[strength]}
            </span>
          </div>
        </div>

        {/* Column 3 — AI suggested reply */}
        <div className="min-w-0 px-4 pb-3 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-900">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" /> AI suggested reply
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <MetricPill label="Lead potential" value={leadLabel} score={op.leadPotential} tone={LEVEL_TONE[leadLabel]} />
              <MetricPill label="Spam risk" value={spamLabel} score={op.spamRisk} tone={RISK_TONE[spamLabel]} suffix="/100" />
            </div>
          </div>

          {editing ? (
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={Math.min(14, Math.max(5, reply.split('\n').length + 1))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-[13px] leading-relaxed text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          ) : (
            <p className="mt-2 line-clamp-5 text-[13px] leading-relaxed text-slate-700">{reply}</p>
          )}

          <div className={`mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium ${Mention.tone}`}>
            <Mention.icon className="h-3.5 w-3.5" />
            {Mention.label}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Button variant="primary" size="sm" onClick={handleOpenAndCopy}>
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied — paste on Reddit' : 'Copy reply & open Reddit'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setEditing((e) => !e)}>
              <Pencil className="h-3.5 w-3.5" /> {editing ? 'Done' : 'Edit'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setS('saved')}>
              <Bookmark className="h-3.5 w-3.5" /> Save for later
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setS('skipped')}>
              <X className="h-3.5 w-3.5" /> Skip
            </Button>
            <button className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {status !== 'pending' && (
            <div className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
              status === 'applied' ? 'bg-emerald-50 text-emerald-700' :
              status === 'skipped' ? 'bg-rose-50 text-rose-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {status === 'applied' && <Check className="h-3 w-3" />}
              {status === 'skipped' && <X className="h-3 w-3" />}
              {status === 'saved' && <Bookmark className="h-3 w-3" />}
              {status === 'applied'
                ? 'Opened on Reddit'
                : status === 'skipped'
                  ? 'Skipped'
                  : 'Saved for later'}
            </div>
          )}

          {warnings.length > 0 && !editing && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{warnings[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  score,
  tone,
  suffix,
}: {
  label: string;
  value: string;
  score: number;
  tone: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
        {value}
      </span>
      <span className="text-[11px] tabular-nums text-slate-500">
        <span className="font-medium text-slate-900">{score}</span>
        {suffix ?? ''}
      </span>
    </div>
  );
}
