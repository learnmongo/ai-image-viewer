'use client';

import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { imageResourcePaths } from '@/lib/image/resource-paths';

interface GridThumbnailImageProps {
  id: string;
  alt: string;
  eager?: boolean;
}

export function GridThumbnailImage({ id, alt, eager = false }: GridThumbnailImageProps) {
  const paths = imageResourcePaths(id);
  const [src, setSrc] = useState(paths.grid);

  return (
    <Box position="relative" width="100%" height="100%" overflow="hidden" borderTopRadius="lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onError={() => setSrc(paths.full)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderTopLeftRadius: 'var(--chakra-radii-lg)',
          borderTopRightRadius: 'var(--chakra-radii-lg)',
        }}
      />
    </Box>
  );
}
