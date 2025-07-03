'use client';

import GlassyModal from './GlassyModal';
import { RawModelResponse } from '@/types/image';
import { Box, Text, Tabs } from '@chakra-ui/react';

interface ModelResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  responses: RawModelResponse[];
}

export default function ModelResponsesModal({ isOpen, onClose, responses }: ModelResponsesModalProps) {
  return (
    <GlassyModal isOpen={isOpen} onClose={onClose} title="Model Responses">
      <Box w="100%" display="flex" justifyContent="center">
        <Box
          bg="gray.900"
          opacity={0.7}
          color="gray.100"
          borderRadius="md"
          p={4}
          fontFamily="body"
          fontSize="md"
          boxShadow="md"
          w="100%"
          maxW="600px"
          overflowX="auto"
        >
          <Tabs.Root defaultValue={responses[0]?.model || ''} variant="subtle" colorScheme="dark" fitted>
            <Tabs.List>
              {responses.map((r) => (
                <Tabs.Trigger key={r.model} value={r.model}>
                  {r.model}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {responses.map((r) => (
              <Tabs.Content
                key={r.model}
                value={r.model}
                style={{ height: '480px', overflowY: 'auto', display: 'flex', alignItems: 'flex-start' }}
              >
                <Box w="100%" p={4}>
                {r.response && (
                    <Box>
                      <Text fontWeight="bold" color="teal.200" mb={1}>Response</Text>
                      <Text whiteSpace="pre-wrap" fontFamily="mono" fontSize="sm" bg="gray.800" p={3} borderRadius="md">{r.response}</Text>
                    </Box>
                  )}
                  {r.prompt && (
                    <Box mb={r.response ? 6 : 0}>
                      <Text fontWeight="bold" color="teal.200" mb={1}>Prompt</Text>
                      <Text whiteSpace="pre-wrap" fontFamily="mono" fontSize="sm" bg="gray.800" p={3} borderRadius="md">{r.prompt}</Text>
                    </Box>
                  )}
                  {!(r.prompt || r.response) && (
                    <Text color="gray.400">No prompt or response available.</Text>
                  )}
                </Box>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </Box>
    </GlassyModal>
  );
} 