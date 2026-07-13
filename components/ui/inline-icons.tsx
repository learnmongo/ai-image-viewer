import type { SVGProps } from 'react';

/** Chakra v2 `@chakra-ui/icons` is incompatible with Chakra v3; use these instead. */

function boxToPx(boxSize: number | string | undefined, fallback: number): string {
  if (boxSize == null) return `${fallback * 4}px`;
  return typeof boxSize === 'number' ? `${boxSize * 4}px` : boxSize;
}

const svgBase = {
  display: 'inline-block' as const,
  verticalAlign: 'middle' as const,
  flexShrink: 0,
};

export function IconHome({
  boxSize = 6,
  ...props
}: SVGProps<SVGSVGElement> & { boxSize?: number | string }) {
  const s = boxToPx(boxSize, 6);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={svgBase}
      {...props}
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    </svg>
  );
}

export function IconHamburger({
  boxSize = 6,
  ...props
}: SVGProps<SVGSVGElement> & { boxSize?: number | string }) {
  const s = boxToPx(boxSize, 6);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={svgBase}
      {...props}
    >
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  );
}

export function IconCopy({
  boxSize = 4,
  ...props
}: SVGProps<SVGSVGElement> & { boxSize?: number | string }) {
  const s = boxToPx(boxSize, 4);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={svgBase}
      {...props}
    >
      <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

export function IconEye({
  boxSize = 4,
  ...props
}: SVGProps<SVGSVGElement> & { boxSize?: number | string }) {
  const s = boxToPx(boxSize, 4);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={svgBase}
      {...props}
    >
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  );
}

export function IconChevronDown({
  boxSize = 5,
  ...props
}: SVGProps<SVGSVGElement> & { boxSize?: number | string }) {
  const s = boxToPx(boxSize, 5);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={svgBase}
      {...props}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChat({
  boxSize = 4,
  ...props
}: SVGProps<SVGSVGElement> & { boxSize?: number | string }) {
  const s = boxToPx(boxSize, 4);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={svgBase}
      {...props}
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );
}
