'use client';

import { IconButton, useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Tooltip } from './ui/tooltip';
import DocumentModal from './DocumentModal';
import { ImageDoc } from '@/types/image';

interface DocumentViewerProps {
  data: ImageDoc;
}

export default function DocumentViewer({ data }: DocumentViewerProps) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip content="View MongoDB Document">
        <IconButton
          aria-label="View MongoDB Document"
          size="sm"
          variant="ghost"
          colorScheme="gray"
          onClick={onOpen}
          style={{ position: 'absolute', bottom: 8, right: 8 }}
        >
          <ViewIcon color="gray.500" boxSize={5} />
        </IconButton>
      </Tooltip>
      <DocumentModal
        isOpen={isOpen}
        onClose={onClose}
        data={data as unknown as Record<string, unknown>}
      />
    </>
  );
} 