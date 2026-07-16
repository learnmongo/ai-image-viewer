'use client';

import { Box, Code, Heading, Link, List, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { GLASS_CARD_NESTED } from '@/components/glass-styles';
import { resolveDocHref } from '@/lib/docs/registry';
import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableColumnHeader,
  GlassTableHeader,
  GlassTableRow,
} from './GlassTable';

interface MarkdownContentProps {
  source: string;
}

function stripLeadingEmoji(text: string): string {
  return text.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '').trim();
}

function textFromChildren(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(textFromChildren).join('');
  return '';
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href) {
    return <Text as="span">{children}</Text>;
  }

  const resolved = resolveDocHref(href);
  const isExternal = /^https?:\/\//i.test(resolved);

  if (isExternal) {
    return (
      <Link href={resolved} color="teal.200" target="_blank" rel="noopener" _hover={{ color: 'teal.100' }}>
        {children}
      </Link>
    );
  }

  if (resolved.startsWith('/')) {
    return (
      <Link as={NextLink} href={resolved} color="teal.200" _hover={{ color: 'teal.100', textDecoration: 'underline' }}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={resolved} color="teal.200" _hover={{ color: 'teal.100' }}>
      {children}
    </Link>
  );
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <Heading as="h1" size="3xl" color="white" mt={8} mb={4} lineHeight="shorter">
      {stripLeadingEmoji(textFromChildren(children))}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size="2xl" color="white" mt={8} mb={3}>
      {stripLeadingEmoji(textFromChildren(children))}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size="xl" color="white" mt={6} mb={2}>
      {stripLeadingEmoji(textFromChildren(children))}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading as="h4" size="lg" color="white" mt={4} mb={2}>
      {stripLeadingEmoji(textFromChildren(children))}
    </Heading>
  ),
  p: ({ children }) => (
    <Text color="whiteAlpha.800" lineHeight="tall" mb={4} fontSize={{ base: 'md', md: 'lg' }}>
      {children}
    </Text>
  ),
  a: ({ href, children }) => <MarkdownLink href={href}>{children}</MarkdownLink>,
  ul: ({ children }) => (
    <List.Root as="ul" gap={2} pl={5} mb={4} color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }}>
      {children}
    </List.Root>
  ),
  ol: ({ children }) => (
    <List.Root as="ol" gap={2} pl={5} mb={4} color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }}>
      {children}
    </List.Root>
  ),
  li: ({ children }) => <List.Item>{children}</List.Item>,
  hr: () => <Box as="hr" border="none" borderTop="1px solid" borderColor="whiteAlpha.200" my={8} />,
  blockquote: ({ children }) => (
    <Box
      borderLeft="3px solid"
      borderColor="whiteAlpha.300"
      pl={4}
      my={4}
      color="whiteAlpha.700"
      fontStyle="italic"
    >
      {children}
    </Box>
  ),
  code: ({ className, children }) => {
    const text = String(children).replace(/\n$/, '');
    const isBlock = Boolean(className) || text.includes('\n');

    if (isBlock) {
      return (
        <Box as="pre" {...GLASS_CARD_NESTED} p={4} overflowX="auto" my={4}>
          <Code
            as="code"
            display="block"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            fontSize="sm"
            fontFamily="mono"
            bg="transparent"
            color="whiteAlpha.900"
            p={0}
          >
            {text}
          </Code>
        </Box>
      );
    }

    return (
      <Code
        fontSize="sm"
        fontFamily="mono"
        bg="whiteAlpha.100"
        color="whiteAlpha.900"
        px={1.5}
        py={0.5}
        borderRadius="sm"
      >
        {text}
      </Code>
    );
  },
  pre: ({ children }) => <Box my={0}>{children}</Box>,
  table: ({ children }) => <GlassTable my={4}>{children}</GlassTable>,
  thead: ({ children }) => <GlassTableHeader>{children}</GlassTableHeader>,
  tbody: ({ children }) => <GlassTableBody>{children}</GlassTableBody>,
  tr: ({ children }) => <GlassTableRow>{children}</GlassTableRow>,
  th: ({ children }) => <GlassTableColumnHeader>{children}</GlassTableColumnHeader>,
  td: ({ children }) => <GlassTableCell>{children}</GlassTableCell>,
  strong: ({ children }) => (
    <Text as="strong" fontWeight="semibold" color="white">
      {children}
    </Text>
  ),
  em: ({ children }) => (
    <Text as="em" fontStyle="italic">
      {children}
    </Text>
  ),
};

export function MarkdownContent({ source }: MarkdownContentProps) {
  return (
    <Box className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {source}
      </ReactMarkdown>
    </Box>
  );
}
