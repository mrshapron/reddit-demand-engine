export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: 'Listen before posting',
    body: 'Lurk for at least a few days. The fastest way to get banned is to post before you understand the room.',
  },
  {
    title: 'Comment before you post',
    body: 'Helpful comments build the karma and pattern-match that lets your eventual post land.',
  },
  {
    title: 'Be a person, not a brand',
    body: 'Reddit smells press releases instantly. Specific stories, real numbers, plain language.',
  },
  {
    title: 'No fake recommendations',
    body: 'Never pretend to be a customer. Never astroturf. We will refuse to generate content that does either.',
  },
  {
    title: 'Human approval, always',
    body: 'Nothing is posted without a human in the loop. We surface; you decide.',
  },
];
