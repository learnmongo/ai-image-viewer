'use client';

import { useMemo, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { DETAIL_IMAGE_PROPS } from '@/lib/image/display-styles';
import { imageResourcePaths } from '@/lib/image/resource-paths';
import { useImagePreload } from '@/hooks/useImagePreload';

interface DetailHeroImageProps {
  id: string;
  alt: string;
  title?: string;
}

export function DetailHeroImage({ id, alt, title }: DetailHeroImageProps) {
  const paths = useMemo(() => imageResourcePaths(id), [id]);
  const loaded = useImagePreload(paths.full);
  const [placeholderFailed, setPlaceholderFailed] = useState(false);

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
    </Box>
  );
}
