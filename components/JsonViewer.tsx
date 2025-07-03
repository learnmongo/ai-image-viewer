import { Box, Code, IconButton, HStack } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { Tooltip } from './ui/tooltip';
import { useState } from 'react';

interface JsonViewerProps {
  data: Record<string, unknown>;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Box position="relative" maxW="600px" w="100%">
      <HStack position="absolute" top={2} right={2} zIndex={1}>
        <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
          <IconButton
            aria-label="Copy raw document to clipboard"
            size="xs"
            variant="ghost"
            colorScheme="gray"
            color="gray.300"
            _hover={{ color: 'white', bg: 'gray.700' }}
            onClick={handleCopy}
            borderRadius="full"
          >
            <CopyIcon boxSize={4} />
          </IconButton>
        </Tooltip>
      </HStack>
      <Code
        as="pre"
        display="block"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        fontSize="sm"
        fontFamily="mono"
        bg="transparent"
        color="inherit"
        p={0}
        m={0}
        border="none"
        minW={0}
        maxW="100%"
      >
        {jsonString}
      </Code>
    </Box>
  );
} 