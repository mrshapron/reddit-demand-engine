import { Users, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBadge, ScoreBar } from '@/components/ui/ScoreBadge';
import { RiskIndicator } from '@/components/ui/RiskIndicator';
import { Tag } from '@/components/ui/Tag';
import type { SubredditInsight } from '@/types/reddit';
import { actionLabel, formatNumber, tolerationLabel } from '@/utils/scoring';
import { REDDIT_LINK_PROPS, subredditUrl } from '@/lib/reddit';

const TONE_TO_BADGE: Record<'good' | 'caution' | 'warn' | 'neutral', 'good' | 'caution' | 'warn' | 'neutral'> = {
  good: 'good',
  caution: 'caution',
  warn: 'warn',
  neutral: 'neutral',
};

export function SubredditCard({ sr }: { sr: SubredditInsight }) {
  const action = actionLabel(sr.recommendedAction ?? 'lurk_first');
  const commonQuestions = sr.commonQuestions ?? [];
  const repeatedPains = sr.repeatedPains ?? [];
  const customerLanguage = sr.customerLanguage ?? [];
  const competitorMentions = sr.competitorMentions ?? [];
  const contentAngles = sr.contentAngles ?? [];
  const rules = sr.rules ?? [];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a
                href={subredditUrl(sr.name)}
                {...REDDIT_LINK_PROPS}
                className="truncate hover:underline"
              >
                <CardTitle className="truncate hover:text-brand-700">{sr.name}</CardTitle>
              </a>
              <Badge tone="brand">{tolerationLabel(sr.promotionTolerance)}</Badge>
              <a
                href={subredditUrl(sr.name)}
                {...REDDIT_LINK_PROPS}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
              >
                <ExternalLink className="h-3 w-3" /> Open
              </a>
            </div>
            <p className="mt-1 text-sm text-slate-600">{sr.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {formatNumber(sr.members)} members
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" /> {commonQuestions.length} live
                questions
              </span>
              <span>karma req: {sr.karmaRequirement}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge tone={TONE_TO_BADGE[action.tone]}>{action.label}</Badge>
            <RiskIndicator risk={sr.spamRisk} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <ScoreCell label="Audience fit" score={sr.audienceFit} />
          <ScoreCell label="Lead potential" score={sr.leadPotential} />
        </div>

        <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
            Why this subreddit matters
          </div>
          <p className="mt-1 text-sm text-slate-700">{sr.whyRelevant}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Common questions" icon={<MessageCircle className="h-3.5 w-3.5" />}>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {commonQuestions.map((q, i) => (
                <li key={`${q}-${i}`} className="flex gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Repeated pains">
            <ul className="space-y-1.5 text-sm text-slate-700">
              {repeatedPains.map((q, i) => (
                <li key={`${q}-${i}`} className="flex gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Customer language">
            <div className="flex flex-wrap gap-1.5">
              {customerLanguage.map((c, i) => (
                <Tag key={`${c}-${i}`}>{c}</Tag>
              ))}
            </div>
          </Section>
          <Section title="Competitor mentions">
            <div className="flex flex-wrap gap-1.5">
              {competitorMentions.map((c, i) => (
                <Tag key={`${c}-${i}`} className="border-rose-100 bg-rose-50 text-rose-700">
                  {c}
                </Tag>
              ))}
            </div>
          </Section>
        </div>

        <Section title="Suggested content angles">
          <ul className="space-y-1.5 text-sm text-slate-700">
            {contentAngles.map((c, i) => (
              <li key={`${c}-${i}`} className="flex gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Subreddit rules to respect">
          <ul className="space-y-1 text-sm text-slate-600">
            {rules.map((r, i) => (
              <li key={`${r}-${i}`}>· {r}</li>
            ))}
          </ul>
        </Section>
      </CardBody>
    </Card>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function ScoreCell({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-100 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <ScoreBadge label="" score={score} compact />
      </div>
      <ScoreBar score={score} className="mt-2" />
    </div>
  );
}
