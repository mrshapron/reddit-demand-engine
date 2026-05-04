import { Router } from 'express';
import { z } from 'zod';
import { EMPTY_PROFILE } from '../types.js';
import { getCompanyProfile, saveCompanyProfile } from '../db/repos.js';

const router = Router();

const ProfileSchema = z.object({
  companyName: z.string(),
  website: z.string(),
  description: z.string(),
  productsServices: z.string(),
  productToPromote: z.string(),
  idealCustomerProfile: z.string(),
  targetCustomerRoles: z.string(),
  customerPains: z.string(),
  problemSolved: z.string(),
  competitors: z.string(),
  toneOfVoice: z.string(),
  positioning: z.string(),
  thingsToAvoid: z.string(),
  proofPoints: z.string(),
  ctaPreference: z.string(),
  targetMarkets: z.string(),
  valueProposition: z.string(),
  exampleUseCases: z.string(),
});

router.get('/', (_req, res) => {
  res.json(getCompanyProfile());
});

router.put('/', (req, res) => {
  const parsed = ProfileSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const merged = { ...EMPTY_PROFILE, ...getCompanyProfile(), ...parsed.data };
  saveCompanyProfile(merged);
  res.json(merged);
});

export default router;
