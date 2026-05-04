import { useState } from 'react';
import {
  Pencil,
  Copy,
  CalendarClock,
  RefreshCcw,
  CheckCircle2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardFooter, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { RiskIndicator, WarningBanner } from '@/components/ui/RiskIndicator';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import type { GeneratedPostDraft } from '@/types/reddit';
import { postTypeLabel, tolerationLabel } from '@/utils/scoring';

export function GeneratedPostCard({ draft }: { draft: GeneratedPostDraft }) {
  const [title, setTitle] = useState(draft.title);
  const [body, setBody] = useState(draft.body);
  const [editing, setEditing] = useState(false);
  const [approved, setApproved] = useState(Boolean(draft.approved));
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text = `${title}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-brand-700">{draft.subreddit}</span>
              <Badge tone="brand">{postTypeLabel(draft.postType)}</Badge>
              <Badge tone="neutral">{tolerationLabel(draft.promotionTolerance)}</Badge>
              {approved && <Badge tone="good">Approved</Badge>}
            </div>
            <p className="mt-1 text-sm text-slate-600">{draft.subredditDescription}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <ScoreBadge label="Fit" score={draft.audienceFit} />
            <ScoreBadge label="Lead" score={draft.leadPotential} />
            <RiskIndicator risk={draft.spamRisk} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Wand2 className="h-3.5 w-3.5 text-brand-500" />
            Suggested title
          </div>
          {editing ? (
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          ) : (
            <CardTitle className="text-base">{title}</CardTitle>
          )}
        </div>

        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Generated body
          </div>
          {editing ? (
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={Math.min(28, Math.max(10, body.split('\n').length + 1))}
            />
          ) : (
            <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-sm leading-6 text-slate-800 scrollbar-thin">
              {body}
            </div>
          )}
        </div>

        <WarningBanner warnings={draft.warnings} />

        <div className="grid gap-3 md:grid-cols-2">
          <Box title="Why this is important">{draft.whyImportant}</Box>
          <Box title="Why it fits this subreddit">{draft.whyFitsSubreddit}</Box>
          <Box title="Customer pain it targets">{draft.customerPainTargeted}</Box>
          <Box title="Recommended CTA" tone="brand">
            {draft.recommendedCta}
          </Box>
        </div>

        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            Reddit-native rewrite suggestions
          </div>
          <ul className="space-y-1 text-sm text-slate-700">
            {draft.redditNativeRewriteSuggestions.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>

      <CardFooter className="flex-wrap justify-between gap-2">
        <div className="text-xs text-slate-500">
          Reddit-native format · human approval required before posting
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setTitle(draft.title); setBody(draft.body); }}>
            <RefreshCcw className="h-3.5 w-3.5" /> Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
            <Pencil className="h-3.5 w-3.5" /> {editing ? 'Done' : 'Edit'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onCopy}>
            <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="secondary" size="sm">
            <CalendarClock className="h-3.5 w-3.5" /> Schedule
          </Button>
          <Button variant={approved ? 'subtle' : 'primary'} size="sm" onClick={() => setApproved((a) => !a)}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {approved ? 'Approved' : 'Mark approved'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function Box({
  title,
  children,
  tone = 'neutral',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'neutral' | 'brand';
}) {
  const cls =
    tone === 'brand'
      ? 'border-brand-100 bg-brand-50/50'
      : 'border-slate-200 bg-slate-100';
  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-sm text-slate-700">{children}</div>
    </div>
  );
}
