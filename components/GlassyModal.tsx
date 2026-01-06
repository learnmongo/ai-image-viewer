import { Box, Button, Text, HStack } from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';

interface GlassyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function GlassyModal({ isOpen, onClose, title, children }: GlassyModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.700"
        zIndex={1000}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 2, md: 4 }}
        onClick={onClose}
      >
      <Box
        bg="rgba(255,255,255,0.18)"
        style={{ backdropFilter: 'blur(24px) saturate(180%)' }}
        color="gray.900"
        borderRadius="xl"
        maxW="700px"
        w="full"
        maxH="90vh"
        overflow="hidden"
        boxShadow="2xl"
        borderWidth="1.5px"
        borderColor="whiteAlpha.400"
        display="flex"
        flexDirection="column"
        onClick={(e) => e.stopPropagation()}
      >
        <HStack justify="space-between" align="center" px={6} py={4} borderBottom="1px" borderColor="gray.200" bg="transparent">
          <Text fontSize="xl" fontWeight="bold" letterSpacing="tight" color="white">
            {title}
          </Text>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            fontSize="2xl"
            color="gray.700"
            borderRadius="full"
            boxShadow="sm"
            bg="whiteAlpha.700"
            _hover={{ bg: 'whiteAlpha.900', color: 'gray.900' }}
            _focus={{ bg: 'whiteAlpha.900', color: 'gray.900', boxShadow: 'outline' }}
            px={0}
            py={0}
            minW={8}
            minH={8}
            w={8}
            h={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            ×
          </Button>
        </HStack>
        <Box flex={1} overflowY="auto" px={6} py={4} bg="transparent">
          {children}
        </Box>
      </Box>
    </Box>
  );
} 