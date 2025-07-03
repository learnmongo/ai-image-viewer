'use client';

import GlassyModal from './GlassyModal';
import JsonViewer from './JsonViewer';
import { RawModelResponse } from '@/types/image';
import { Box } from '@chakra-ui/react';

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
          color="gray.100"
          borderRadius="md"
          p={4}
          fontFamily="mono"
          fontSize="sm"
          boxShadow="md"
          w="100%"
          maxW="600px"
          overflowX="auto"
        >
          <JsonViewer data={{ responses }} />
        </Box>
      </Box>
    </GlassyModal>
  );
} 