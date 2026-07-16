/** Append alpha hex (e.g. `cc`) to `#RGB` / `#RRGGBB` for valid 8-digit CSS colors. */
export function hexWithAlpha(hex: string | undefined, fallback: string, alphaHex = 'cc'): string {
  let h = (hex ?? fallback).trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length === 6) return `#${h}${alphaHex}`;
  const fb = fallback.replace(/^#/, '');
  const core =
    fb.length === 3
      ? fb
          .split('')
          .map((c) => c + c)
          .join('')
      : fb.slice(0, 6).padEnd(6, '0');
  return `#${core}${alphaHex}`;
}
