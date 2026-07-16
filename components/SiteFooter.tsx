'use client';

import { Box, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function SiteFooter() {
  return (
    <Box
      as="footer"
      w="100%"
      py={6}
      px={{ base: 4, md: 8 }}
      textAlign="center"
      color="whiteAlpha.600"
      fontSize="sm"
    >
      <Text>
        Created by{' '}
        <Link
          as={NextLink}
          href="https://justinjenkins.net"
          color="whiteAlpha.700"
          textDecoration="underline"
          _hover={{ color: 'white' }}
          target="_blank"
        >
          Justin Jenkins
        </Link>{' '}
        via{' '}
        <Link
          as={NextLink}
          href="https://learnmongo.com"
          color="whiteAlpha.700"
          textDecoration="underline"
          _hover={{ color: 'white' }}
          target="_blank"
        >
          LearnMongo
        </Link>
        <Text as="span" mx={2} color="whiteAlpha.400">
          |
        </Text>
        <Link
          as={NextLink}
          href="/how-its-built"
          color="whiteAlpha.700"
          textDecoration="underline"
          _hover={{ color: 'white' }}
        >
          How it's built
        </Link>
      </Text>
    </Box>
  );
}
