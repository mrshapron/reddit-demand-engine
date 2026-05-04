import type { CompanyProfile } from '@/types/company';

export const mockCompanyProfile: CompanyProfile = {
  companyName: 'Acme SaaS',
  website: 'https://acme.example.com',
  description:
    'Acme SaaS is a workflow automation platform that helps B2B SaaS teams replace brittle Zapier chains and manual approvals with reliable, observable workflows that ops and RevOps leaders can actually own.',
  productsServices:
    'Visual workflow builder, native integrations with HubSpot/Salesforce/Slack/Notion, approval flows, audit logs, team-level permissions, AI step generation.',
  productToPromote:
    'Acme Workflow Cloud — a Zapier alternative built for ops and RevOps teams who have outgrown no-code glue.',
  idealCustomerProfile:
    'Series A–C B2B SaaS companies (50–500 employees) running revenue and customer ops. Teams that already use Zapier/Make for at least 30 workflows and feel pain.',
  targetCustomerRoles:
    'RevOps leaders, Ops Managers, Customer Operations leads, Founders at <50 person SaaS, Salesforce admins doubling as ops.',
  customerPains:
    'Zapier chains breaking silently, no audit trail, repeated manual approvals, tool sprawl across 8+ apps, no version control, lost time chasing data between systems, vendor lock-in.',
  problemSolved:
    'We replace brittle multi-step Zaps with reliable workflows that have version history, approvals, retries, and observability — so ops teams can ship automations without paging engineering.',
  competitors:
    'Zapier, Make (Integromat), Workato, Tray.io, n8n, Pipedream, Retool Workflows.',
  toneOfVoice:
    'Helpful, human, confident. Specific over generic. Never salesy. Sounds like a senior ops practitioner sharing what worked.',
  positioning:
    'The workflow platform ops teams adopt after Zapier breaks at scale. Built for reliability, not for the no-code demo.',
  thingsToAvoid:
    'Do not say "game-changer", "revolutionary", "10x", "best in class", "leverage", or "synergy". Do not name-drop the product unsolicited. Do not claim to replace Zapier in one line. Do not post fake testimonials. Avoid affiliate-style language.',
  proofPoints:
    'Ramp ops team cut workflow incidents 78% in Q3. Vercel RevOps replaced 142 Zaps and saved $34k/yr. Average customer ships their first production workflow in 90 minutes.',
  ctaPreference:
    'Soft CTAs only. Prefer "happy to share what we did internally" or "DM me if useful, no pitch" over any link drop. Never link in the first 3 comments of a thread.',
  targetMarkets:
    'North America and Western Europe. English-speaking SaaS communities. Vertical focus: B2B SaaS, fintech, dev tools.',
  valueProposition:
    'Workflows that don\'t break at 2am — built so an ops lead can ship, debug, and audit without writing code.',
  exampleUseCases:
    'Closed-won → handoff workflow with manager approval. Stripe failed payment → CSM alert with replay. SOC 2 evidence collection across Linear, GitHub, and AWS. NPS detractor → CS playbook.',
};
