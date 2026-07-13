/** Robot head for hybrid / AI-assisted search; uses `currentColor`. */
export function RobotGlyph() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path d="M12 8V4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" />
      <rect
        x="6"
        y="8"
        width="12"
        height="11"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect x="8.25" y="11.25" width="2.25" height="2.25" rx="0.5" fill="currentColor" />
      <rect x="13.5" y="11.25" width="2.25" height="2.25" rx="0.5" fill="currentColor" />
      <path d="M9 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
