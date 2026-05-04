import express from 'express';
import cors from 'cors';
import { env, redditOauthEnabled } from './env.js';
import { MODEL_FAST, MODEL_SMART, PROVIDER } from './llm/client.js';
import { migrate } from './db/schema.js';
import companyRouter from './routes/company.js';
import subredditsRouter from './routes/subreddits.js';
import opportunitiesRouter from './routes/opportunities.js';
import draftsRouter from './routes/drafts.js';
import strategyRouter from './routes/strategy.js';
import ingestRouter from './routes/ingest.js';

migrate();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    redditOauth: redditOauthEnabled,
    provider: PROVIDER,
    models: { fast: MODEL_FAST, smart: MODEL_SMART },
  });
});

app.use('/api/company', companyRouter);
app.use('/api/subreddits', subredditsRouter);
app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/drafts', draftsRouter);
app.use('/api/strategy', strategyRouter);
app.use('/api/ingest', ingestRouter);

// JSON 404
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('[server] error', err);
    res.status(500).json({ error: err.message });
  },
);

app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT}`);
  console.log(
    `[server] reddit OAuth: ${redditOauthEnabled ? 'enabled' : 'disabled (read-only via public JSON)'}`,
  );
});
