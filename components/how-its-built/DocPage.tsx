'use client';

import { Box, Heading, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { GLASS_CARD } from '@/components/glass-styles';
import { DocEntry, docHref } from '@/lib/docs/registry';
import { GuidePageShell } from './GuidePageShell';
import { MarkdownContent } from './MarkdownContent';

interface DocPageProps {
  doc: DocEntry;
  markdown: string;
}

export function DocPage({ doc, markdown }: DocPageProps) {
  return (
    <GuidePageShell maxW="800px">
      <Box mb={6}>
        <Link
          as={NextLink}
          href="/how-its-built"
          fontSize="sm"
          color="whiteAlpha.600"
          _hover={{ color: 'teal.200', textDecoration: 'none' }}
        >
          ← Project guide
        </Link>
      </Box>

      <Box mb={8} {...GLASS_CARD} p={{ base: 5, md: 7 }}>
        <Text fontSize="xs" letterSpacing="wider" textTransform="uppercase" color="whiteAlpha.700" mb={2}>
          {doc.fileName}
        </Text>
        <Heading size="2xl" color="white" mb={3}>
          {doc.title}
        </Heading>
        <Text color="whiteAlpha.800" lineHeight="tall">
          {doc.description}
        </Text>
      </Box>

      <Box {...GLASS_CARD} p={{ base: 5, md: 7 }}>
        <MarkdownContent source={markdown} />
      </Box>

      <Box mt={8} textAlign="center">
        <Link
          as={NextLink}
          href={docHref('readme')}
          fontSize="sm"
          color="whiteAlpha.600"
          mr={4}
          _hover={{ color: 'teal.200' }}
        >
          README
        </Link>
        <Link
          as={NextLink}
          href="/how-its-built"
          fontSize="sm"
          color="whiteAlpha.600"
          _hover={{ color: 'teal.200' }}
        >
          Project guide
        </Link>
      </Box>
    </GuidePageShell>
  );
}
