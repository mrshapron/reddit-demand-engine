import { useState, useEffect, FormEvent } from 'react';
import { Save, RotateCcw, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCompanyProfile } from '@/store/companyStore';
import type { CompanyProfile } from '@/types/company';

export function CompanyForm() {
  const { profile, saveProfile, resetProfile, saving } = useCompanyProfile();
  const [draft, setDraft] = useState<CompanyProfile>(profile);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDraft(profile), [profile]);

  const set = <K extends keyof CompanyProfile>(k: K) => (v: string) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await saveProfile(draft);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2500);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section
        title="Identity"
        description="Who you are and what you sell."
      >
        <Grid>
          <Field label="Company name" required>
            <Input value={draft.companyName} onChange={(e) => set('companyName')(e.target.value)} placeholder="Acme SaaS" />
          </Field>
          <Field label="Website">
            <Input value={draft.website} onChange={(e) => set('website')(e.target.value)} placeholder="https://..." />
          </Field>
        </Grid>
        <Field label="Company description" required hint="One paragraph. Plain language, no taglines.">
          <Textarea value={draft.description} onChange={(e) => set('description')(e.target.value)} rows={3} />
        </Field>
        <Grid>
          <Field label="Products / services sold">
            <Textarea value={draft.productsServices} onChange={(e) => set('productsServices')(e.target.value)} rows={3} />
          </Field>
          <Field label="Product you want to promote">
            <Textarea value={draft.productToPromote} onChange={(e) => set('productToPromote')(e.target.value)} rows={3} />
          </Field>
        </Grid>
      </Section>

      <Section title="Customers" description="Who you sell to and what hurts.">
        <Grid>
          <Field label="Ideal customer profile (ICP)" required>
            <Textarea value={draft.idealCustomerProfile} onChange={(e) => set('idealCustomerProfile')(e.target.value)} rows={3} />
          </Field>
          <Field label="Target customer roles">
            <Textarea value={draft.targetCustomerRoles} onChange={(e) => set('targetCustomerRoles')(e.target.value)} rows={3} />
          </Field>
        </Grid>
        <Grid>
          <Field label="Main customer pains" required hint="Comma-separated or short sentences.">
            <Textarea value={draft.customerPains} onChange={(e) => set('customerPains')(e.target.value)} rows={3} />
          </Field>
          <Field label="Problem solved">
            <Textarea value={draft.problemSolved} onChange={(e) => set('problemSolved')(e.target.value)} rows={3} />
          </Field>
        </Grid>
        <Field label="Target markets" hint="Geographies, verticals, language.">
          <Input value={draft.targetMarkets} onChange={(e) => set('targetMarkets')(e.target.value)} />
        </Field>
      </Section>

      <Section title="Positioning" description="How you talk about it.">
        <Grid>
          <Field label="Competitors / alternatives">
            <Textarea value={draft.competitors} onChange={(e) => set('competitors')(e.target.value)} rows={3} />
          </Field>
          <Field label="Tone of voice">
            <Textarea value={draft.toneOfVoice} onChange={(e) => set('toneOfVoice')(e.target.value)} rows={3} />
          </Field>
        </Grid>
        <Grid>
          <Field label="Positioning">
            <Textarea value={draft.positioning} onChange={(e) => set('positioning')(e.target.value)} rows={3} />
          </Field>
          <Field label="Value proposition">
            <Textarea value={draft.valueProposition} onChange={(e) => set('valueProposition')(e.target.value)} rows={3} />
          </Field>
        </Grid>
        <Field label="Things to avoid saying" hint="Banned words, fake claims, anything that reads as marketing.">
          <Textarea value={draft.thingsToAvoid} onChange={(e) => set('thingsToAvoid')(e.target.value)} rows={3} />
        </Field>
      </Section>

      <Section title="Proof and CTA" description="What you can credibly say, and what action you want.">
        <Field label="Example proof points / results" hint="Real numbers, real customers (or anonymized).">
          <Textarea value={draft.proofPoints} onChange={(e) => set('proofPoints')(e.target.value)} rows={3} />
        </Field>
        <Field label="Example use cases">
          <Textarea value={draft.exampleUseCases} onChange={(e) => set('exampleUseCases')(e.target.value)} rows={3} />
        </Field>
        <Field label="CTA preference" hint="Soft DM offer, link drop, no CTA, etc.">
          <Textarea value={draft.ctaPreference} onChange={(e) => set('ctaPreference')(e.target.value)} rows={2} />
        </Field>
      </Section>

      <Card>
        <CardFooter className="justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {savedAt && (
              <Badge tone="good">
                <CheckCircle2 className="h-3 w-3" /> Saved
              </Badge>
            )}
            {error && (
              <Badge tone="warn">
                <AlertTriangle className="h-3 w-3" /> {error}
              </Badge>
            )}
            <span className="text-xs">
              Stored on the server. Used as context for every reply, post, and recommendation.
            </span>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={resetProfile} disabled={saving}>
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {saving ? 'Saving…' : 'Save profile'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardBody className="space-y-4">{children}</CardBody>
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
