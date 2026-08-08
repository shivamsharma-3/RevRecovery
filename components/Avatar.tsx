import React from 'react';

/**
 * Initials avatar rendered locally.
 *
 * Replaces picsum.photos portraits (random strangers standing in for patients,
 * which is a strange look for a healthcare product) and ui-avatars.com, which
 * sent the signed-in user's email to a third party on every dashboard render.
 */

const PALETTE = [
  { bg: 'bg-teal-100', fg: 'text-teal-700' },
  { bg: 'bg-blue-100', fg: 'text-blue-700' },
  { bg: 'bg-amber-100', fg: 'text-amber-700' },
  { bg: 'bg-violet-100', fg: 'text-violet-700' },
  { bg: 'bg-rose-100', fg: 'text-rose-700' },
  { bg: 'bg-emerald-100', fg: 'text-emerald-700' },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic colour so the same person keeps the same avatar between renders. */
function paletteFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({
  name,
  className = 'w-10 h-10',
  textClassName = 'text-sm',
}: {
  name?: string | null;
  className?: string;
  textClassName?: string;
}) {
  const safe = (name || '').trim() || 'Unknown';
  const { bg, fg } = paletteFor(safe);

  return (
    <div
      className={`${className} ${bg} ${fg} rounded-full flex items-center justify-center font-bold shrink-0 select-none`}
      title={safe}
      aria-hidden="true"
    >
      <span className={textClassName}>{initialsOf(safe)}</span>
    </div>
  );
}
