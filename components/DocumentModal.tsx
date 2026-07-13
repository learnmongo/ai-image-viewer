import GlassyModal from './GlassyModal';
import JsonViewer from './JsonViewer';
import { Box } from '@chakra-ui/react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>;
}

/** Keys omitted from the JSON view (noise, huge vectors, duplicate traces). */
const OMIT_FROM_DOCUMENT_VIEW = new Set([
  'file',
  'raw',
  'prompt_debug',
  'embedding',
]);

export default function DocumentModal({ isOpen, onClose, data }: DocumentModalProps) {
  const cleanData: Record<string, unknown> = { ...data };
  for (const key of OMIT_FROM_DOCUMENT_VIEW) {
    delete cleanData[key];
  }

  return (
    <GlassyModal isOpen={isOpen} onClose={onClose} title="Document">
      <Box w="100%" display="flex" justifyContent="center">
        <Box
          bg="rgba(15, 23, 42, 0.55)"
          backdropFilter="blur(12px) saturate(140%)"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          color="gray.100"
          borderRadius="xl"
          p={4}
          fontFamily="mono"
          fontSize="sm"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.08)"
          w="100%"
          maxW="600px"
          overflowX="auto"
        >
          <JsonViewer data={cleanData} />
        </Box>
      </Box>
    </GlassyModal>
  );
}
