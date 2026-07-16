'use client';

/**
 * Image view narrative block. Icon-only glass CTA — no teal (or loud accent fills); see README.
 */

import { IconChevronDown } from '@/components/ui/inline-icons';
import { Box, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface ImageNarrativeCardProps {
  description?: string | null;
  summary?: string | null;
}

/** Shared body copy — description and expanded summary use the same rhythm. */
const bodyProps = {
  fontSize: { base: 'md', md: 'lg' } as const,
  fontWeight: 'normal' as const,
  lineHeight: 1.75,
  color: 'white',
  textAlign: 'center' as const,
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
  w: '100%',
};

export function ImageNarrativeCard({ description, summary }: ImageNarrativeCardProps) {
  const hasDesc = Boolean(description?.trim());
  const hasSum = Boolean(summary?.trim());
  const [moreRevealed, setMoreRevealed] = useState(false);

  if (!hasDesc && !hasSum) return null;

  const showTellMore = hasSum && !moreRevealed;

  return (
    <Box
      alignSelf="stretch"
      w="100%"
      mb={6}
      borderRadius="2xl"
      position="relative"
      overflow="hidden"
      px={{ base: 3, md: 4 }}
      py={{ base: 3, md: 4 }}
      bg="linear-gradient(145deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.12) 100%)"
      backdropFilter="blur(28px) saturate(180%)"
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.22)"
      boxShadow="
        0 4px 6px rgba(0,0,0,0.08),
        0 24px 48px rgba(0,0,0,0.18),
        inset 0 1px 0 rgba(255,255,255,0.2)
      "
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {hasDesc && <Text {...bodyProps}>{description}</Text>}

      {hasSum && summary && moreRevealed && (
        <>
          {hasDesc && (
            <Box
              w="100%"
              maxW="12rem"
              h="1px"
              mx="auto"
              my={3}
              bg="rgba(255,255,255,0.28)"
              boxShadow="0 0 12px rgba(255,255,255,0.15)"
              aria-hidden
            />
          )}
          <Text {...bodyProps}>{summary}</Text>
        </>
      )}

      {showTellMore && (
        <Box display="flex" justifyContent="center" mt={hasDesc ? 3 : 0}>
          <Button
            type="button"
            variant="ghost"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="44px"
            h="44px"
            minW="44px"
            p={0}
            borderRadius="full"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.22)"
            bg="rgba(255,255,255,0.07)"
            backdropFilter="blur(16px) saturate(150%)"
            color="whiteAlpha.900"
            boxShadow="0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12)"
            transition="background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease"
            aria-label="Show more detail"
            _hover={{
              bg: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.32)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
            _focusVisible={{
              outline: '2px solid',
              outlineColor: 'whiteAlpha.600',
              outlineOffset: '3px',
            }}
            onClick={() => setMoreRevealed(true)}
          >
            <IconChevronDown boxSize={6} style={{ opacity: 0.85 }} />
          </Button>
        </Box>
      )}
    </Box>
  );
}
