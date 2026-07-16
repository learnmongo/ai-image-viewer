import { useBreakpointValue } from '@chakra-ui/react';

const EAGER_GRID_COUNT = { base: 1, sm: 2, md: 3, lg: 4 } as const;

export function useEagerGridCount() {
  return useBreakpointValue(EAGER_GRID_COUNT) ?? 4;
}
