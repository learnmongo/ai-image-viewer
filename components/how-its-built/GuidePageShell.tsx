import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const GUIDE_PAGE_BACKGROUND =
  'linear-gradient(155deg, #04060a 0%, #0a0f18 28%, #0d1524 52%, #080c14 78%, #05070c 100%)';

interface GuidePageShellProps {
  children: ReactNode;
  maxW?: string;
}

export function GuidePageShell({ children, maxW = '1100px' }: GuidePageShellProps) {
  return (
    <Box
      minH="100vh"
      w="100%"
      maxW="100%"
      bg={GUIDE_PAGE_BACKGROUND}
      color="white"
      px={{
        base: 'max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-right))',
        md: 6,
        lg: 8,
      }}
      pt={{ base: 5, md: 6 }}
      pb={{ base: 8, md: 12 }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(ellipse 80% 60% at 15% 40%, rgba(30, 41, 59, 0.45) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 75%, rgba(15, 23, 42, 0.4) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Box position="relative" zIndex={1} w="100%" minW={0} maxW={maxW} mx="auto">
        {children}
      </Box>
    </Box>
  );
}
