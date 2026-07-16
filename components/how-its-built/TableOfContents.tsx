'use client';

import { Box, Link, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GLASS_CARD } from '@/components/glass-styles';

export interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(id);
          });
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  const linkStyles = (id: string) => ({
    display: 'block',
    py: 1.5,
    fontSize: 'sm',
    color: activeId === id ? 'white' : 'whiteAlpha.600',
    fontWeight: activeId === id ? 'semibold' : 'normal',
    _hover: { color: 'white', textDecoration: 'none' },
    transition: 'color 0.15s ease',
  });

  return (
    <>
      {/* Mobile: collapsible */}
      <Box display={{ base: 'block', lg: 'none' }} mb={6} mt={12}>
        <Box as="details" {...GLASS_CARD} borderRadius="lg" p={4}>
          <Box as="summary" cursor="pointer" fontWeight="semibold" color="white" listStyleType="none">
            On this page
          </Box>
          <Box as="nav" mt={3}>
            {items.map(({ id, label }) => (
              <Link key={id} href={`#${id}`} {...linkStyles(id)}>
                {label}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Desktop: sticky sidebar */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        position="sticky"
        top="72px"
        alignSelf="start"
        w="220px"
        flexShrink={0}
      >
        <Text fontSize="sm" fontWeight="semibold" color="white" mb={3}>
          On this page
        </Text>
        <Box as="nav">
          {items.map(({ id, label }) => (
            <Link key={id} href={`#${id}`} {...linkStyles(id)}>
              {label}
            </Link>
          ))}
        </Box>
      </Box>
    </>
  );
}
