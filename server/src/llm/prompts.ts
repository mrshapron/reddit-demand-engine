import type { CompanyProfile } from '../types.js';

export function companyContext(profile: CompanyProfile): string {
  return [
    `Company: ${profile.companyName}`,
    profile.website && `Website: ${profile.website}`,
    profile.description && `Description: ${profile.description}`,
    profile.productsServices && `Products / services: ${profile.productsServices}`,
    profile.productToPromote && `Product to promote: ${profile.productToPromote}`,
    profile.idealCustomerProfile && `ICP: ${profile.idealCustomerProfile}`,
    profile.targetCustomerRoles && `Target roles: ${profile.targetCustomerRoles}`,
    profile.customerPains && `Customer pains: ${profile.customerPains}`,
    profile.problemSolved && `Problem solved: ${profile.problemSolved}`,
    profile.competitors && `Competitors: ${profile.competitors}`,
    profile.toneOfVoice && `Tone of voice: ${profile.toneOfVoice}`,
    profile.positioning && `Positioning: ${profile.positioning}`,
    profile.thingsToAvoid && `Things to AVOID: ${profile.thingsToAvoid}`,
    profile.proofPoints && `Proof points: ${profile.proofPoints}`,
    profile.ctaPreference && `CTA preference: ${profile.ctaPreference}`,
    profile.targetMarkets && `Target markets: ${profile.targetMarkets}`,
    profile.valueProposition && `Value proposition: ${profile.valueProposition}`,
    profile.exampleUseCases && `Example use cases: ${profile.exampleUseCases}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export const PRINCIPLES = `Hard rules you MUST follow:
- Reddit users hate obvious marketing. Sound like a peer, not a salesperson.
- Listen first. Helpful, specific, human replies beat sales copy.
- Never pretend to be a fake customer. Never fabricate experiences. Never recommend deceptive promotion.
- Do not name the company in a top-level reply unless explicitly safe. Soft mentions or "happy to DM" are usually safer.
- Always explain why an action is recommended.
- Refuse anything that involves impersonation, fake reviews, or astroturfing.`;
