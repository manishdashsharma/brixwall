import { cn } from '../../lib/cn.js';

const TONE_CLASSES = {
  ok: 'bg-ok shadow-[0_0_8px_var(--color-ok)]',
  warn: 'bg-warn animate-pulse',
  bad: 'bg-bad animate-pulse',
  off: 'bg-off',
};

export default function StatusDot({ tone, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block shrink-0 rounded-full ring-2 ring-white/70',
        TONE_CLASSES[tone],
        className
      )}
    />
  );
}
