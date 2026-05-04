import { CalendarClock, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskIndicator } from '@/components/ui/RiskIndicator';
import type { ScheduledPost, ScheduledPostStatus } from '@/types/reddit';
import { postTypeLabel, tolerationLabel } from '@/utils/scoring';

const STATUS_LABELS: Record<ScheduledPostStatus, string> = {
  approved: 'Approved',
  scheduled: 'Scheduled',
  needs_final_review: 'Needs final review',
  ready_for_reddit_api: 'Ready for Reddit API',
};

export function ScheduledPostCard({ post }: { post: ScheduledPost }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-brand-700">{post.subreddit}</span>
              <Badge tone="brand">{postTypeLabel(post.postType)}</Badge>
              <Badge tone="neutral">{tolerationLabel(post.promotionTolerance)}</Badge>
              <Badge tone={post.status === 'scheduled' ? 'good' : post.status === 'needs_final_review' ? 'warn' : 'brand'}>
                {STATUS_LABELS[post.status]}
              </Badge>
            </div>
            <CardTitle className="mt-2">{post.title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-600">{post.bodyPreview}</p>
          </div>
          <div className="shrink-0">
            <RiskIndicator risk={post.spamRisk} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">
            <CalendarClock className="mr-1 h-3.5 w-3.5" />
            {post.scheduledFor}
          </Badge>
          <Badge tone="neutral">Manual queue today</Badge>
          <Badge tone="neutral">Automation-ready later</Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Box title="Why this is scheduled">{post.businessGoal}</Box>
          <Box title="Recommended CTA" tone="brand">{post.recommendedCta}</Box>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
            <ShieldAlert className="h-3.5 w-3.5" />
            Safety notes before posting
          </div>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {post.safetyNotes.map((note, index) => (
              <li key={`${note}-${index}`} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>

      <CardFooter className="flex-wrap justify-between gap-2">
        <div className="text-xs text-slate-500">
          Future Reddit API step: publish automatically after OAuth + final approval.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm">Final review</Button>
          <Button variant="ghost" size="sm">Edit time</Button>
          <Button variant="ghost" size="sm">Copy post</Button>
          <Button variant="ghost" size="sm">Remove</Button>
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
  const cls = tone === 'brand' ? 'border-brand-100 bg-brand-50/50' : 'border-slate-200 bg-slate-100';
  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-sm text-slate-700">{children}</div>
    </div>
  );
}
