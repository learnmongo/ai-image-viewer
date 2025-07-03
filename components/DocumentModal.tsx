import GlassyModal from './GlassyModal';
import JsonViewer from './JsonViewer';
import { Box } from '@chakra-ui/react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>;
}

export default function DocumentModal({ isOpen, onClose, data }: DocumentModalProps) {
  return (
    <GlassyModal isOpen={isOpen} onClose={onClose} title="Document">
      <Box w="100%" display="flex" justifyContent="center">
        <Box
          bg="gray.900"
          color="gray.100"
          opacity={0.7}
          borderRadius="md"
          p={4}
          fontFamily="mono"
          fontSize="sm"
          boxShadow="md"
          w="100%"
          maxW="600px"
          overflowX="auto"
        >
          <JsonViewer data={data} />
        </Box>
      </Box>
    </GlassyModal>
  );
} 