'use client';

import { IconHome } from '@/components/ui/inline-icons';
import { Box, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

/** Visuals aligned with non-hybrid `SearchInputBar` outer shell (pill glass). */
const SEARCH_PILL_GLASS = {
  position: 'relative' as const,
  isolation: 'isolate' as const,
  borderRadius: 'full',
  borderWidth: '1px',
  borderColor: 'rgba(255,255,255,0.26)',
  bg: 'rgba(255,255,255,0.24)',
  backdropFilter: 'blur(22px) saturate(170%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.50), 0 10px 34px rgba(0,0,0,0.22)',
} as const;

export default function ViewHomeChrome() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={1100}
      pt="max(10px, env(safe-area-inset-top, 0px))"
      pl="max(12px, env(safe-area-inset-left, 0px))"
      pointerEvents="none"
    >
      <Link
        as={NextLink}
        href="/"
        aria-label="Home"
        pointerEvents="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="44px"
        h="44px"
        color="white"
        transition="border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease"
        {...SEARCH_PILL_GLASS}
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'full',
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.02) 100%)',
          mixBlendMode: 'screen',
          opacity: 0.75,
        }}
        _hover={{
          textDecoration: 'none',
          color: 'white',
          borderColor: 'rgba(255,255,255,0.40)',
          bg: 'rgba(255,255,255,0.28)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.65), 0 0 0 3px rgba(255,255,255,0.16), 0 12px 40px rgba(0,0,0,0.26)',
        }}
        _focus={{ boxShadow: 'none', outline: 'none' }}
        _focusVisible={{
          borderColor: 'rgba(255,255,255,0.40)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.65), 0 0 0 3px rgba(255,255,255,0.16), 0 12px 40px rgba(0,0,0,0.26)',
        }}
      >
        <Box
          position="relative"
          zIndex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconHome boxSize={6} />
        </Box>
      </Link>
    </Box>
  );
}
