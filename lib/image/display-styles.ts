import type { ImageProps } from '@chakra-ui/react';
import type { CSSProperties } from 'react';

export const DETAIL_IMAGE_PROPS = {
  w: '100%',
  h: 'auto',
  maxW: '100%',
  maxH: '75vh',
  mx: 'auto',
  my: 0,
  rounded: '2xl',
} satisfies Pick<ImageProps, 'w' | 'h' | 'maxW' | 'maxH' | 'mx' | 'my' | 'rounded'>;

export const GRID_THUMB_IMG_STYLE: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};
