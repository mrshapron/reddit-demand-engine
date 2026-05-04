/** Build a public reddit.com URL for a subreddit (handles "r/SaaS" or "SaaS"). */
export function subredditUrl(name: string): string {
  const clean = name.replace(/^r\//, '').replace(/^\/+|\/+$/g, '');
  return `https://www.reddit.com/r/${clean}/`;
}

/** Open the URL in a new tab with proper rel attributes. */
export const REDDIT_LINK_PROPS = {
  target: '_blank' as const,
  rel: 'noreferrer noopener' as const,
};

/** Copy text to the system clipboard, returning whether it succeeded. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
