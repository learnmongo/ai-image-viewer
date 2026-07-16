'use client';

import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { EmotionCacheProvider } from '@/components/EmotionCacheProvider';
import { customSystem } from '@/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={customSystem}>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
