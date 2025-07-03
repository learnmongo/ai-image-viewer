'use client';

import { Box, Flex, Link, Icon } from '@chakra-ui/react';
import NextLink from 'next/link';

const NAV_HEIGHT = '48px';

export default function ClientNavBar() {
  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h={NAV_HEIGHT}
      px={6}
      py={2}
      style={{
        background: 'rgba(24, 24, 28, 0.32)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
      }}
      color="white"
      zIndex={100}
      display="flex"
      alignItems="center"
      transition="background 0.3s"
    >
      <Flex align="center">
        <Link
          as={NextLink}
          href="/"
          aria-label="Home"
          _hover={{ color: 'teal.200', bg: 'whiteAlpha.300', textDecoration: 'none' }}
          color="white"
          p={1}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="background 0.2s, color 0.2s"
        >
          <Icon viewBox="0 0 24 24" boxSize={6} color="white" opacity={1} style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>
            <path
              fill="currentColor"
              d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11.5z"
            />
          </Icon>
        </Link>
      </Flex>
    </Box>
  );
} 