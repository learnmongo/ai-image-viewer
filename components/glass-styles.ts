/** Shared frosted-glass surface tokens (image cards, promo, project guide sections). */
export const GLASS_CARD = {
  bg: 'rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(24px) saturate(180%)',
  borderWidth: '1px',
  borderColor: 'whiteAlpha.200',
  borderRadius: '2xl',
  boxShadow: '2xl',
} as const;

/** Grid/search image cards: flush on mobile, rounded glass from `sm` up. */
export const GLASS_IMAGE_CARD = {
  bg: GLASS_CARD.bg,
  backdropFilter: GLASS_CARD.backdropFilter,
  borderColor: GLASS_CARD.borderColor,
  borderRadius: { base: 0, sm: 'lg' },
  borderWidth: { base: '0 0 1px 0', sm: '1px' },
  boxShadow: { base: 'none', sm: '2xl' },
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  _hover: {
    boxShadow: '2xl',
    borderColor: 'whiteAlpha.300',
  },
} as const;

export const GLASS_CARD_NESTED = {
  bg: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(20px) saturate(170%)',
  borderWidth: '1px',
  borderColor: 'whiteAlpha.200',
  borderRadius: 'lg',
} as const;
