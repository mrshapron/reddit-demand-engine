import { applyCors, callClaude, errorResponse, handleOptions, readJsonBody } from './_shared.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const { companyProfile, subreddit, subredditInsight, postType } = body;

    const result = await callClaude({
      system:
        'You are a senior Reddit-native demand generation strategist. Generate helpful, human, non-spammy Reddit content. Never fake customer stories, never recommend deceptive promotion, and always protect community trust. Return JSON only.',
      user: `Generate one Reddit post draft.

Company profile:
${JSON.stringify(companyProfile, null, 2)}

Target subreddit: ${subreddit}
Subreddit insight:
${JSON.stringify(subredditInsight, null, 2)}

Requested post type: ${postType}

Return JSON with exactly these fields:
{
  "title": "string",
  "body": "string",
  "whyImportant": "string",
  "whyFitsSubreddit": "string",
  "customerPainTargeted": "string",
  "recommendedCta": "string",
  "redditNativeRewriteSuggestions": ["string"],
  "warnings": ["string"],
  "spamRisk": number
}

Rules:
- The body must be Reddit-native, specific, and useful without a product link.
- Do not write ad copy.
- Do not include fake proof.
- If product mention is risky, say so in warnings.
- spamRisk must be 0-100.`,
    });

    res.status(200).json(result);
  } catch (error) {
    errorResponse(res, error);
  }
}
