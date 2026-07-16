'use client';

import { GLASS_IMAGE_CARD } from '@/components/glass-styles';
import { Box, BoxProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ImageGridCardProps extends BoxProps {
  children: ReactNode;
}

export function ImageGridCard({ children, ...rest }: ImageGridCardProps) {
  return (
    <Box {...GLASS_IMAGE_CARD} h="100%" display="flex" flexDirection="column" {...rest}>
      {children}
    </Box>
  );
}
