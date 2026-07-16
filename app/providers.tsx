'use client';

import { EmotionCacheProvider } from '@/components/EmotionCacheProvider';
import { customSystem } from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={customSystem}>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
