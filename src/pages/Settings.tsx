import { ShieldCheck, Plug, KeyRound, Database, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';

export function Settings() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Workspace settings"
        description="Connections, safety guardrails, and team preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Safety guardrails
            </CardTitle>
            <CardDescription>Cannot be turned off. These exist to protect your brand.</CardDescription>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2 text-sm">
              <Toggle label="Require human approval before any external action" on locked />
              <Toggle label="Block deceptive promotion (fake reviews, astroturfing)" on locked />
              <Toggle label="Refuse to impersonate a customer" on locked />
              <Toggle label="Warn before posting in promotion-intolerant subreddits" on />
              <Toggle label="Strip banned phrases from drafts (game-changer, 10x, leverage…)" on />
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Plug className="h-4 w-4 text-brand-600" /> Connections
            </CardTitle>
            <CardDescription>Connect your Reddit account to fetch live data instead of mocks.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            <Connection name="Reddit account (read-only)" status="not_connected" hint="OAuth read scope only — used to surface posts, never to post on your behalf." />
            <Connection name="Reddit account (post on approval)" status="not_connected" hint="OAuth submit scope. Only fires when a human clicks Apply." />
            <Connection name="Slack notifications" status="not_connected" hint="Notify a channel when a high-fit opportunity is surfaced." />
            <Connection name="Notion / Linear (drafts)" status="not_connected" hint="Mirror approved drafts to your team's planning tool." />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand-600" /> LLM provider
            </CardTitle>
            <CardDescription>Used for reply generation, post drafting, and intent classification.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <Field label="Provider">
              <Input value="anthropic (mock)" readOnly />
            </Field>
            <Field label="API key" hint="Stored client-side for now. Move to a server route before production.">
              <Input type="password" placeholder="sk-…" />
            </Field>
          </CardBody>
          <CardFooter>
            <Button variant="primary" size="sm">Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-600" /> Storage
            </CardTitle>
            <CardDescription>Where your company profile and approved drafts live.</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium">Currently using browser localStorage</div>
                  <div className="text-xs">
                    Swap <code className="rounded bg-amber-100 px-1 py-0.5">src/store/companyStore.tsx</code> to a fetch-based
                    implementation against your API. The interface is designed to make this a one-file change.
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function Toggle({ label, on, locked }: { label: string; on?: boolean; locked?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-100 p-2.5">
      <span className="text-slate-800">{label}</span>
      <div className="flex items-center gap-2">
        {locked && <Badge tone="neutral">locked</Badge>}
        <span
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            on ? 'bg-brand-600' : 'bg-slate-300'
          } ${locked ? 'opacity-90' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-slate-100 shadow transition-transform ${
              on ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </span>
      </div>
    </li>
  );
}

function Connection({
  name,
  status,
  hint,
}: {
  name: string;
  status: 'connected' | 'not_connected';
  hint: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-100 p-3">
      <div className="min-w-0">
        <div className="font-medium text-slate-900">{name}</div>
        <div className="text-xs text-slate-500">{hint}</div>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={status === 'connected' ? 'good' : 'neutral'}>
          {status === 'connected' ? 'Connected' : 'Not connected'}
        </Badge>
        <Button variant="secondary" size="sm">
          {status === 'connected' ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}
