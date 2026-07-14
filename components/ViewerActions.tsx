'use client';

import { HStack, Button } from '@chakra-ui/react';
import { IconChat, IconEye } from './ui/inline-icons';
import { useState } from 'react';
import DocumentModal from './DocumentModal';
import ModelResponsesModal from './ModelResponsesModal';
import { RawModelResponse, ImageItem } from '@/types/image';

interface ViewerActionsProps {
  document: ImageItem;
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
          colorPalette="gray"
          gap={2}
          px={5}
          py={2}
          onClick={() => setDocOpen(true)}
        >
          <IconEye boxSize={4} />
          Document
        </Button>
        <Button
          size="sm"
          variant="ghost"
          colorPalette="gray"
          gap={2}
          px={5}
          py={2}
          onClick={() => setResponsesOpen(true)}
        >
          <IconChat boxSize={4} />
          Model Responses
        </Button>
      </HStack>
      <DocumentModal
        isOpen={isDocOpen}
        onClose={() => setDocOpen(false)}
        data={document}
      />
      <ModelResponsesModal
        isOpen={isResponsesOpen}
        onClose={() => setResponsesOpen(false)}
        responses={responses}
      />
    </>
  );
} 