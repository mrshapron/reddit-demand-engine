import { migrate } from '../db/schema.js';
import { runIngest } from '../pipeline/ingest.js';

migrate();

const subreddits = process.argv.slice(2).filter(Boolean);
const summary = await runIngest(subreddits.length ? { subreddits } : {});
console.log(JSON.stringify(summary, null, 2));
process.exit(summary.errors.length ? 1 : 0);
