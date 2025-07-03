'use client';
import { Box, Flex, Link } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

const NAV_HEIGHT = '40px';

export default function NavBar() {
  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h={NAV_HEIGHT}
      px={4}
      py={2}
      zIndex={1100}
      style={{
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1.5px solid rgba(255,255,255,0.4)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
      }}
      color="white"
      display="flex"
      alignItems="center"
      transition="background 0.3s"
    >
      <Flex align="center" flex={1}>
        <Flex gap={6} align="center">
          <Link
            as={NextLink}
            href="/"
            _hover={{ color: 'teal.200', textDecoration: 'none' }}
            _focus={{ boxShadow: 'none', outline: 'none' }}
            _active={{ boxShadow: 'none', outline: 'none' }}
            color="white"
            display="flex"
            alignItems="center"
          >
            <HamburgerIcon boxSize={6} style={{ marginRight: 6 }} />
          </Link>
          {/* Add more navigation links here as needed */}
        </Flex>
      </Flex>
    </Box>
  );
} 