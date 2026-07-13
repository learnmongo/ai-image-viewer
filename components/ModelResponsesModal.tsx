'use client';

import type { ReactNode } from 'react';
import GlassyModal from './GlassyModal';
import { RawModelResponse } from '@/types/image';
import { Box, Text, Tabs } from '@chakra-ui/react';

interface ModelResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  responses: RawModelResponse[];
}

const monoBlockProps = {
  whiteSpace: 'pre-wrap' as const,
  fontFamily: 'mono',
  fontSize: 'sm',
  bg: 'gray.800',
  p: 3,
  borderRadius: 'md',
};

function toDisplayText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function hasResponse(r: RawModelResponse): boolean {
  const v = r.response;
  if (v == null) return false;
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text fontWeight="bold" color="teal.200" mb={1}>
      {children}
    </Text>
  );
}

export default function ModelResponsesModal({ isOpen, onClose, responses }: ModelResponsesModalProps) {
  return (
    <GlassyModal isOpen={isOpen} onClose={onClose} title="Model Responses">
      <Box w="100%" display="flex" justifyContent="center">
        <Box
          bg="rgba(15, 23, 42, 0.55)"
          backdropFilter="blur(12px) saturate(140%)"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          color="gray.100"
          borderRadius="xl"
          p={4}
          fontFamily="body"
          fontSize="md"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.08)"
          w="100%"
          maxW="600px"
          overflowX="auto"
        >
          {responses.length === 0 ? (
            <Text color="gray.400" fontSize="sm">
              No model responses for this image.
            </Text>
          ) : (
            <Tabs.Root defaultValue="0" variant="subtle" colorPalette="gray" fitted>
              <Tabs.List>
                {responses.map((r, i) => (
                  <Tabs.Trigger key={`${r.model}-${i}`} value={String(i)}>
                    {r.model}
                    {r.version ? ` · ${r.version}` : ''}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {responses.map((r, i) => (
                <Tabs.Content
                  key={`${r.model}-${i}`}
                  value={String(i)}
                  h="480px"
                  overflowY="auto"
                  display="flex"
                  alignItems="flex-start"
                >
                  <Box w="100%" p={4}>
                    {hasResponse(r) && (
                      <Box mb={r.prompt ? 6 : 0}>
                        <SectionLabel>Response</SectionLabel>
                        <Text {...monoBlockProps}>{toDisplayText(r.response)}</Text>
                      </Box>
                    )}
                    {r.prompt ? (
                      <Box>
                        <SectionLabel>Prompt</SectionLabel>
                        <Text {...monoBlockProps}>{r.prompt}</Text>
                      </Box>
                    ) : null}
                    {!r.prompt && !hasResponse(r) ? (
                      <Text color="gray.400">No prompt or response available.</Text>
                    ) : null}
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          )}
        </Box>
      </Box>
    </GlassyModal>
  );
}
