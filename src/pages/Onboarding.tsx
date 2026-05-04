import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Headphones,
  Loader2,
  MessageSquareReply,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  OnboardingShell,
  StepCard,
  type StepMeta,
} from '@/components/onboarding/OnboardingShell';
import { useCompanyProfile } from '@/store/companyStore';
import { api } from '@/lib/api';
import type { CompanyProfile } from '@/types/company';

const STEPS: StepMeta[] = [
  { id: 'welcome', label: 'Welcome', shortLabel: 'Welcome' },
  { id: 'identity', label: 'Identity', shortLabel: 'Identity' },
  { id: 'customers', label: 'Customers', shortLabel: 'Customers' },
  { id: 'voice', label: 'Voice & positioning', shortLabel: 'Voice' },
  { id: 'proof', label: 'Proof & CTA', shortLabel: 'Proof' },
  { id: 'subreddits', label: 'Subreddits', shortLabel: 'Subreddits' },
];

type Validator = (p: CompanyProfile) => string | null;

const VALIDATORS: Record<string, Validator> = {
  identity: (p) =>
    !p.companyName.trim()
      ? 'Company name is required.'
      : !p.description.trim()
        ? 'Add a one-paragraph description.'
        : null,
  customers: (p) =>
    !p.idealCustomerProfile.trim()
      ? 'Describe your ideal customer.'
      : !p.customerPains.trim()
        ? 'List the main pains you solve.'
        : null,
};

export function Onboarding() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { profile, updateProfile, saveProfile, saving } = useCompanyProfile();

  const stepFromUrl = params.get('step');
  const initialIndex = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.id === stepFromUrl);
    return idx >= 0 ? idx : 0;
  }, [stepFromUrl]);

  const [index, setIndex] = useState(initialIndex);
  const [error, setError] = useState<string | null>(null);
  const step = STEPS[index]!;

  useEffect(() => {
    setParams({ step: step.id }, { replace: true });
  }, [step.id, setParams]);

  const goNext = async () => {
    setError(null);
    const validate = VALIDATORS[step.id];
    if (validate) {
      const msg = validate(profile);
      if (msg) {
        setError(msg);
        return;
      }
    }
    if (index < STEPS.length - 1) {
      await saveProfile(profile);
      setIndex(index + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    setError(null);
    if (index > 0) {
      setIndex(index - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = async () => {
    try {
      await saveProfile(profile);
    } catch {
      /* ignore */
    }
    navigate('/dashboard');
  };

  const finish = async () => {
    setError(null);
    await saveProfile(profile);
    navigate('/dashboard');
  };

  return (
    <OnboardingShell steps={STEPS} currentIndex={index} onSkip={handleSkip}>
      {step.id === 'welcome' && <WelcomeStep onNext={goNext} />}

      {step.id === 'identity' && (
        <IdentityStep
          profile={profile}
          onChange={updateProfile}
          onBack={goBack}
          onNext={goNext}
          error={error}
          saving={saving}
        />
      )}

      {step.id === 'customers' && (
        <CustomersStep
          profile={profile}
          onChange={updateProfile}
          onBack={goBack}
          onNext={goNext}
          error={error}
          saving={saving}
        />
      )}

      {step.id === 'voice' && (
        <VoiceStep
          profile={profile}
          onChange={updateProfile}
          onBack={goBack}
          onNext={goNext}
          saving={saving}
        />
      )}

      {step.id === 'proof' && (
        <ProofStep
          profile={profile}
          onChange={updateProfile}
          onBack={goBack}
          onNext={goNext}
          saving={saving}
        />
      )}

      {step.id === 'subreddits' && (
        <SubredditsStep onBack={goBack} onFinish={finish} saving={saving} />
      )}
    </OnboardingShell>
  );
}

// ─── Step 1: Welcome ────────────────────────────────────────────────

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <StepCard
      eyebrow="Get started"
      title="Let's set up your Reddit demand engine"
      description="Five quick screens. The richer this is, the better every reply, post, and recommendation will be. You can edit anything later."
      footer={
        <>
          <span className="text-xs text-slate-500">Takes about 3 minutes.</span>
          <Button variant="primary" onClick={onNext}>
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Pillar
          icon={<Headphones className="h-5 w-5 text-brand-600" />}
          title="Listen"
          body="We watch the subreddits where your buyers hang out and surface what they're actually saying."
        />
        <Pillar
          icon={<MessageSquareReply className="h-5 w-5 text-brand-600" />}
          title="Respond"
          body="High-intent posts are scored against your profile and we draft a reply you can edit and approve."
        />
        <Pillar
          icon={<Sparkles className="h-5 w-5 text-brand-600" />}
          title="Post"
          body="When a community is friendly to it, we draft Reddit-native posts — never marketing copy."
        />
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
        <strong className="font-semibold text-amber-100">We never auto-post.</strong> Every reply and
        post requires your explicit click. We refuse anything that smells like astroturf or fake
        reviews.
      </div>
    </StepCard>
  );
}

function Pillar({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-200/40 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
        {icon}
      </div>
      <div className="mt-2.5 text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

// ─── Step 2: Identity ───────────────────────────────────────────────

interface StepProps {
  profile: CompanyProfile;
  onChange: (patch: Partial<CompanyProfile>) => void;
  onBack: () => void;
  onNext: () => void;
  error?: string | null;
  saving: boolean;
}

function StepFooter({
  onBack,
  onNext,
  nextLabel = 'Continue',
  saving,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  saving: boolean;
}) {
  return (
    <>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Button>
      <Button variant="primary" onClick={onNext} disabled={saving}>
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ArrowRight className="h-3.5 w-3.5" />
        )}
        {nextLabel}
      </Button>
    </>
  );
}

function IdentityStep({ profile, onChange, onBack, onNext, error, saving }: StepProps) {
  return (
    <StepCard
      eyebrow="Step 1 of 5"
      title="Tell us about your company"
      description="Plain language beats taglines here. Pretend you're explaining the company to a smart friend."
      footer={<StepFooter onBack={onBack} onNext={onNext} saving={saving} />}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company name" required>
          <Input
            value={profile.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Acme SaaS"
            autoFocus
          />
        </Field>
        <Field label="Website">
          <Input
            value={profile.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://example.com"
          />
        </Field>
      </div>
      <Field label="What does your company do?" required hint="One paragraph, no marketing voice.">
        <Textarea
          value={profile.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          placeholder="We build a workflow automation platform for small RevOps teams who outgrow Zapier but can't afford Workato…"
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Products / services" hint="Anything you actually sell.">
          <Textarea
            value={profile.productsServices}
            onChange={(e) => onChange({ productsServices: e.target.value })}
            rows={3}
          />
        </Field>
        <Field label="The product you want to promote" hint="If different from above.">
          <Textarea
            value={profile.productToPromote}
            onChange={(e) => onChange({ productToPromote: e.target.value })}
            rows={3}
          />
        </Field>
      </div>
      <FormError error={error} />
    </StepCard>
  );
}

// ─── Step 3: Customers ──────────────────────────────────────────────

function CustomersStep({ profile, onChange, onBack, onNext, error, saving }: StepProps) {
  return (
    <StepCard
      eyebrow="Step 2 of 5"
      title="Who buys this, and what hurts?"
      description="The pains drive everything else — they're how we recognize a real opportunity in the wild."
      footer={<StepFooter onBack={onBack} onNext={onNext} saving={saving} />}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Ideal customer profile (ICP)" required>
          <Textarea
            value={profile.idealCustomerProfile}
            onChange={(e) => onChange({ idealCustomerProfile: e.target.value })}
            rows={3}
            placeholder="20–200 person SaaS companies, no dedicated ops team, currently using 3+ disconnected automation tools."
            autoFocus
          />
        </Field>
        <Field label="Target roles" hint="The people who'd actually buy or champion.">
          <Textarea
            value={profile.targetCustomerRoles}
            onChange={(e) => onChange({ targetCustomerRoles: e.target.value })}
            rows={3}
            placeholder="RevOps lead, Head of CS, ops-minded founder, salesforce admin"
          />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Main customer pains" required hint="Comma-separated or short sentences.">
          <Textarea
            value={profile.customerPains}
            onChange={(e) => onChange({ customerPains: e.target.value })}
            rows={3}
            placeholder="Silent Zap failures; tool sprawl; no audit trail; engineering won't own glue work"
          />
        </Field>
        <Field label="What problem do you solve?">
          <Textarea
            value={profile.problemSolved}
            onChange={(e) => onChange({ problemSolved: e.target.value })}
            rows={3}
          />
        </Field>
      </div>
      <Field label="Target markets" hint="Geographies, verticals, language.">
        <Input
          value={profile.targetMarkets}
          onChange={(e) => onChange({ targetMarkets: e.target.value })}
          placeholder="US + EU SaaS, English-speaking, post-Series-A"
        />
      </Field>
      <FormError error={error} />
    </StepCard>
  );
}

// ─── Step 4: Voice & positioning ────────────────────────────────────

function VoiceStep({ profile, onChange, onBack, onNext, saving }: StepProps) {
  return (
    <StepCard
      eyebrow="Step 3 of 5"
      title="How do you talk about it?"
      description="Tone, positioning, and what NEVER to say. This shapes every word we draft."
      footer={<StepFooter onBack={onBack} onNext={onNext} saving={saving} />}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Competitors / alternatives">
          <Textarea
            value={profile.competitors}
            onChange={(e) => onChange({ competitors: e.target.value })}
            rows={3}
            placeholder="Zapier, Make, Workato, n8n"
          />
        </Field>
        <Field label="Tone of voice" hint="2-3 adjectives + an example phrase.">
          <Textarea
            value={profile.toneOfVoice}
            onChange={(e) => onChange({ toneOfVoice: e.target.value })}
            rows={3}
            placeholder='Direct, technical, dry-humored. Sounds like a senior engineer, not marketing.'
          />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Positioning">
          <Textarea
            value={profile.positioning}
            onChange={(e) => onChange({ positioning: e.target.value })}
            rows={3}
            placeholder="The workflow platform built for ops people who can't get engineering time."
          />
        </Field>
        <Field label="Value proposition">
          <Textarea
            value={profile.valueProposition}
            onChange={(e) => onChange({ valueProposition: e.target.value })}
            rows={3}
          />
        </Field>
      </div>
      <Field
        label="Things to AVOID saying"
        hint='Banned words, fake claims, anything that reads as marketing. "Game-changer", "leverage", etc.'
      >
        <Textarea
          value={profile.thingsToAvoid}
          onChange={(e) => onChange({ thingsToAvoid: e.target.value })}
          rows={3}
        />
      </Field>
    </StepCard>
  );
}

// ─── Step 5: Proof & CTA ────────────────────────────────────────────

function ProofStep({ profile, onChange, onBack, onNext, saving }: StepProps) {
  return (
    <StepCard
      eyebrow="Step 4 of 5"
      title="What can you credibly say?"
      description="Numbers, named customers (or anonymized), and what action you actually want from a Reddit reader."
      footer={<StepFooter onBack={onBack} onNext={onNext} saving={saving} />}
    >
      <Field label="Proof points / results" hint="Real numbers beat adjectives every time.">
        <Textarea
          value={profile.proofPoints}
          onChange={(e) => onChange({ proofPoints: e.target.value })}
          rows={3}
          placeholder='Cut workflow incidents 78% at a 60-person SaaS. Migrated 142 Zaps in 3 weeks.'
        />
      </Field>
      <Field label="Example use cases">
        <Textarea
          value={profile.exampleUseCases}
          onChange={(e) => onChange({ exampleUseCases: e.target.value })}
          rows={3}
          placeholder='Closed-won → onboarding handoff. Lead routing. SOC 2 evidence collection. Detractor follow-up.'
        />
      </Field>
      <Field
        label="CTA preference"
        hint='How should a reply end? "Soft DM offer", "no CTA", "link drop only if asked", etc.'
      >
        <Textarea
          value={profile.ctaPreference}
          onChange={(e) => onChange({ ctaPreference: e.target.value })}
          rows={2}
        />
      </Field>
    </StepCard>
  );
}

// ─── Step 6: Subreddits ─────────────────────────────────────────────

interface SearchResult {
  name: string;
  members: number;
  description: string;
}

function SubredditsStep({
  onBack,
  onFinish,
  saving,
}: {
  onBack: () => void;
  onFinish: () => void;
  saving: boolean;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [added, setAdded] = useState<{ name: string; members: number }[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listConfiguredSubreddits()
      .then((names) => {
        if (cancelled) return;
        setAdded(names.map((name) => ({ name, members: 0 })));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await api.searchSubreddits(q, 10);
      setResults(res);
    } catch (e) {
      setSearchError((e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (name: string) => {
    if (added.some((a) => a.name === name)) return;
    setAdding(name);
    try {
      const res = await api.addSubreddit(name);
      setAdded((a) => [...a, { name: res.name, members: res.members }]);
    } catch (e) {
      setSearchError((e as Error).message);
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = async (name: string) => {
    setAdded((a) => a.filter((x) => x.name !== name));
    try {
      await api.removeSubreddit(name);
    } catch {
      /* ignore */
    }
  };

  const handleFinishWithIngest = async () => {
    setRunError(null);
    if (added.length === 0) {
      onFinish();
      return;
    }
    setRunning(true);
    try {
      await api.startIngest();
      onFinish();
    } catch (e) {
      setRunError((e as Error).message);
      setRunning(false);
    }
  };

  return (
    <StepCard
      eyebrow="Step 5 of 5"
      title="Pick subreddits to watch"
      description="Add 3-5 communities where your buyers actually hang out. We'll start scraping and analyzing them right away."
      footer={
        <>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onFinish}>
              Skip ingest
            </Button>
            <Button
              variant="primary"
              onClick={handleFinishWithIngest}
              disabled={running || saving}
            >
              {running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {running ? 'Starting…' : added.length ? 'Finish & ingest' : 'Finish'}
            </Button>
          </div>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-slate-200/40 p-4">
        <Field label="Search Reddit for a subreddit" htmlFor="sr-search">
          <div className="flex gap-2">
            <Input
              id="sr-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="e.g. RevOps, SaaS, customersuccess"
            />
            <Button variant="primary" onClick={search} disabled={searching}>
              {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </Field>
        {searchError && (
          <p className="mt-2 text-xs text-rose-600">{searchError}</p>
        )}

        {results.length > 0 && (
          <ul className="mt-3 max-h-72 space-y-1 overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-1">
            {results.map((r) => {
              const isAdded = added.some((a) => a.name === r.name);
              return (
                <li
                  key={r.name}
                  className="flex items-start justify-between gap-3 rounded-md px-2 py-2 hover:bg-slate-200"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {r.name}
                      </span>
                      <span className="text-[11px] tabular-nums text-slate-500">
                        {r.members.toLocaleString()} members
                      </span>
                    </div>
                    <div className="line-clamp-2 text-xs text-slate-500">
                      {r.description || 'No description'}
                    </div>
                  </div>
                  <Button
                    variant={isAdded ? 'subtle' : 'secondary'}
                    size="sm"
                    onClick={() => (isAdded ? undefined : handleAdd(r.name))}
                    disabled={isAdded || adding === r.name}
                  >
                    {adding === r.name ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isAdded ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    {isAdded ? 'Added' : 'Add'}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Watching {added.length} subreddit{added.length === 1 ? '' : 's'}
          </h3>
          {added.length > 0 && (
            <Badge tone="good">
              <CheckCircle2 className="h-3 w-3" /> Saved
            </Badge>
          )}
        </div>
        {added.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-200/30 p-6 text-center text-sm text-slate-500">
            None yet. Search above and add a few.
          </div>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {added.map((s) => (
              <li
                key={s.name}
                className="group inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-2 text-xs font-medium text-brand-800"
              >
                <span>{s.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(s.name)}
                  className="rounded-full p-0.5 text-brand-600 hover:bg-brand-100"
                  aria-label={`Remove ${s.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {runError && <FormError error={runError} />}
      <p className="text-xs text-slate-500">
        After you finish, the first ingest can take a minute. We'll scrape recent posts, score
        each one against your profile, and draft replies for the high-signal ones.
      </p>
    </StepCard>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function FormError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
      {error}
    </div>
  );
}
