/** Shared responsive layout tokens for mobile edge-to-edge images. */

export const MOBILE_PAGE_PX = { base: 0, md: 4, lg: 8 } as const;

/** Inset for text and chrome below flush images on narrow screens. */
export const MOBILE_CONTENT_PX = { base: 3, md: 0 } as const;

export const IMAGE_GRID_COLUMNS = { base: 1, sm: 2, md: 3, lg: 4 } as const;

export const VIEW_HOME_BUTTON_SIZE = '44px';

/** Aligns page content with the fixed home chip top edge on mobile. */
export const VIEW_PAGE_TOP_PT = {
  base: 'max(10px, env(safe-area-inset-top, 0px))',
  md: 6,
} as const;

/** Symmetric inset so centered titles clear the fixed home chip on mobile. */
export const VIEW_TITLE_PX = {
  base: `max(12px, calc(${VIEW_HOME_BUTTON_SIZE} + env(safe-area-inset-left, 0px) + 8px))`,
  md: 0,
} as const;

/** Title band height on mobile — matches the home chip for a single compact header row. */
export const VIEW_TITLE_MIN_H = {
  base: VIEW_HOME_BUTTON_SIZE,
  md: 'auto',
} as const;
