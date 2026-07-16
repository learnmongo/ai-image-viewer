'use client';

import { GLASS_CARD } from '@/components/glass-styles';
import { Box, Link, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

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
          <Box
            as="summary"
            cursor="pointer"
            fontWeight="semibold"
            color="white"
            listStyleType="none"
          >
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

      {/* Desktop: reserve horizontal space in the flex row */}
      <Box display={{ base: 'none', lg: 'block' }} w="220px" flexShrink={0} aria-hidden />

      {/* Desktop: fixed sidebar (sticky breaks under body overflow-x: hidden) */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        position="fixed"
        top="64px"
        left="max(32px, calc((100vw - 1100px) / 2 + 32px))"
        w="220px"
        maxH="calc(100vh - 80px)"
        overflowY="auto"
        zIndex={100}
        pb={4}
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
