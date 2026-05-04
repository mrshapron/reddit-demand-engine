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
    const { companyProfile, opportunity } = body;

    const result = await callClaude({
      system:
        'You are a senior Reddit reply strategist. Write helpful, human, non-spammy replies. Do not astroturf. Do not pretend to be a customer. Return JSON only.',
      user: `Regenerate a suggested Reddit reply.

Company profile:
${JSON.stringify(companyProfile, null, 2)}

Reddit opportunity:
${JSON.stringify(opportunity, null, 2)}

Return JSON with exactly this shape:
{
  "suggestedReply": "string",
  "replyStrategy": "string",
  "warnings": ["string"],
  "shouldMentionProduct": boolean,
  "productMention": "do_not_mention" | "mention_softly" | "safe_to_mention"
}

Rules:
- Answer the Reddit post first.
- Prefer useful advice over promotion.
- Mention the product only if clearly appropriate.
- No fake customer claims.
- No links unless the user explicitly asks for tools.`,
    });

    res.status(200).json({ triage: result, reply: result });
  } catch (error) {
    errorResponse(res, error);
  }
}
