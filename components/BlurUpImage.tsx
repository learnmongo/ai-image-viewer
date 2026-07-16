'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';

type BlurUpImageProps = {
  id: string;
  alt: string;
  variant: 'grid' | 'detail';
  title?: string;
  eager?: boolean;
};

function imagePaths(id: string) {
  return {
    placeholder: `/resources/${id}-ph.webp`,
    grid: `/resources/${id}-grid.webp`,
    full: `/resources/${id}.jpg`,
  };
}

const detailImageProps = {
  w: '100%',
  h: 'auto',
  maxW: '100%',
  maxH: '75vh',
  mx: 'auto',
  my: 0,
  rounded: '2xl' as const,
};

export function BlurUpImage({ id, alt, variant, title, eager = false }: BlurUpImageProps) {
  const paths = imagePaths(id);
  const [gridSrc, setGridSrc] = useState(paths.grid);
  const [loaded, setLoaded] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const preloadRef = useRef<HTMLImageElement>(null);

  const handleFullLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (variant !== 'detail') return;
    const img = preloadRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [variant, paths.full]);

  if (variant === 'grid') {
    return (
      <Box position="relative" width="100%" height="100%" overflow="hidden" borderTopRadius="lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gridSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          onError={() => setGridSrc(paths.full)}
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

  return (
    <Box width="100%" mb={6}>
      {loaded ? (
        <Image
          src={paths.full}
          alt={alt}
          title={title}
          {...detailImageProps}
          boxShadow="2xl"
        />
      ) : placeholderVisible ? (
        <Image
          src={paths.placeholder}
          alt=""
          aria-hidden
          {...detailImageProps}
          filter="blur(12px)"
          transform="scale(1.05)"
          onError={() => setPlaceholderVisible(false)}
        />
      ) : null}
      {!loaded && (
        // Preload full-res off-screen, then swap to visible Chakra Image
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={preloadRef}
          src={paths.full}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          onLoad={handleFullLoad}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
        />
      )}
    </Box>
  );
}
