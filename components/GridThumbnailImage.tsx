'use client';

import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { GRID_THUMB_IMG_STYLE } from '@/lib/image/display-styles';
import { imageResourcePaths } from '@/lib/image/resource-paths';
import { useImageSrcFallback } from '@/hooks/useImageSrcFallback';

interface GridThumbnailImageProps {
  id: string;
  alt: string;
  eager?: boolean;
}

export function GridThumbnailImage({ id, alt, eager = false }: GridThumbnailImageProps) {
  const paths = useMemo(() => imageResourcePaths(id), [id]);
  const { src, onError } = useImageSrcFallback(paths.grid, paths.full);

  return (
    <Box position="relative" width="100%" height="100%" overflow="hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onError={onError}
        style={GRID_THUMB_IMG_STYLE}
      />
    </Box>
  );
}
