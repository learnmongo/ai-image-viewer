/** Shared frosted-glass surface tokens (image cards, promo, project guide sections). */
export const GLASS_CARD = {
  bg: 'rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(24px) saturate(180%)',
  borderWidth: '1px',
  borderColor: 'whiteAlpha.200',
  borderRadius: '2xl',
  boxShadow: '2xl',
} as const;

export const GLASS_CARD_NESTED = {
  bg: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(20px) saturate(170%)',
  borderWidth: '1px',
  borderColor: 'whiteAlpha.200',
  borderRadius: 'lg',
} as const;
