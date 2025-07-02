'use client';

import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { customSystem } from '@/theme';

export function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider value={customSystem}>{children}</ChakraProvider>;
}
