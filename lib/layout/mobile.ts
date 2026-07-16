/** Shared responsive layout tokens for mobile edge-to-edge images. */

export const MOBILE_PAGE_PX = { base: 0, md: 4, lg: 8 } as const;

/** Inset for text and chrome below flush images on narrow screens. */
export const MOBILE_CONTENT_PX = { base: 3, md: 0 } as const;

export const IMAGE_GRID_COLUMNS = { base: 1, sm: 2, md: 3, lg: 4 } as const;

export const VIEW_HOME_BUTTON_SIZE = '44px';

export const VIEW_PAGE_TOP_PT = {
  base: `calc(${VIEW_HOME_BUTTON_SIZE} + max(10px, env(safe-area-inset-top, 0px)) + 12px)`,
  md: 6,
} as const;

/** Keeps centered view titles clear of the fixed home chip on mobile. */
export const VIEW_TITLE_PX = {
  base: `max(12px, calc(${VIEW_HOME_BUTTON_SIZE} + env(safe-area-inset-left, 0px) + 12px))`,
  md: 0,
} as const;
