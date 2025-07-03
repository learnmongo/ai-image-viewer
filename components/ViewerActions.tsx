'use client';

import { HStack, Button } from '@chakra-ui/react';
import { ViewIcon, ChatIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import DocumentModal from './DocumentModal';
import ModelResponsesModal from './ModelResponsesModal';
import { ImageDoc, RawModelResponse } from '@/types/image';

interface ViewerActionsProps {
  document: ImageDoc;
  responses: RawModelResponse[];
}

export default function ViewerActions({ document, responses }: ViewerActionsProps) {
  const [isDocOpen, setDocOpen] = useState(false);
  const [isResponsesOpen, setResponsesOpen] = useState(false);

  return (
    <>
      <HStack mt={6} mb={2}>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          px={5}
          py={2}
          onClick={() => setDocOpen(true)}
        >
          <ViewIcon boxSize={4} style={{ marginRight: 6 }} />
          View Document
        </Button>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          px={5}
          py={2}
          onClick={() => setResponsesOpen(true)}
        >
          <ChatIcon boxSize={4} style={{ marginRight: 6 }} />
          View Model Responses
        </Button>
      </HStack>
      <DocumentModal
        isOpen={isDocOpen}
        onClose={() => setDocOpen(false)}
        data={document as unknown as Record<string, unknown>}
      />
      <ModelResponsesModal
        isOpen={isResponsesOpen}
        onClose={() => setResponsesOpen(false)}
        responses={responses}
      />
    </>
  );
} 