'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { imageResourcePaths } from '@/lib/image/resource-paths';

const DETAIL_IMAGE_PROPS = {
  w: '100%',
  h: 'auto',
  maxW: '100%',
  maxH: '75vh',
  mx: 'auto',
  my: 0,
  rounded: '2xl' as const,
};

interface DetailHeroImageProps {
  id: string;
  alt: string;
  title?: string;
}

export function DetailHeroImage({ id, alt, title }: DetailHeroImageProps) {
  const paths = imageResourcePaths(id);
  const [loaded, setLoaded] = useState(false);
  const [placeholderFailed, setPlaceholderFailed] = useState(false);
  const preloadRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = preloadRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [paths.full]);

  return (
    <Box width="100%" mb={6}>
      {loaded ? (
        <Image src={paths.full} alt={alt} title={title} {...DETAIL_IMAGE_PROPS} boxShadow="2xl" />
      ) : !placeholderFailed ? (
        <Image
          src={paths.placeholder}
          alt=""
          aria-hidden
          {...DETAIL_IMAGE_PROPS}
          filter="blur(12px)"
          transform="scale(1.05)"
          onError={() => setPlaceholderFailed(true)}
        />
      ) : null}
      {!loaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={preloadRef}
          src={paths.full}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
        />
      )}
    </Box>
  );
}
