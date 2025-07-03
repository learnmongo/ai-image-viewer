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
                <Text whiteSpace="pre-wrap" p={4} w="100%">
                  {r.response}
                </Text>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </Box>
    </GlassyModal>
  );
} 