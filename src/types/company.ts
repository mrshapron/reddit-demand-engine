export interface CompanyProfile {
  companyName: string;
  website: string;
  description: string;
  productsServices: string;
  productToPromote: string;
  idealCustomerProfile: string;
  targetCustomerRoles: string;
  customerPains: string;
  problemSolved: string;
  competitors: string;
  toneOfVoice: string;
  positioning: string;
  thingsToAvoid: string;
  proofPoints: string;
  ctaPreference: string;
  targetMarkets: string;
  valueProposition: string;
  exampleUseCases: string;
}

export const EMPTY_PROFILE: CompanyProfile = {
  companyName: '',
  website: '',
  description: '',
  productsServices: '',
  productToPromote: '',
  idealCustomerProfile: '',
  targetCustomerRoles: '',
  customerPains: '',
  problemSolved: '',
  competitors: '',
  toneOfVoice: '',
  positioning: '',
  thingsToAvoid: '',
  proofPoints: '',
  ctaPreference: '',
  targetMarkets: '',
  valueProposition: '',
  exampleUseCases: '',
};
