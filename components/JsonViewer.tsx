'use client';

import { Box, Code, HStack, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { IconCopy } from './ui/inline-icons';
import { Tooltip } from './ui/tooltip';

interface JsonViewerProps {
  data: Record<string, unknown>;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    void navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Box position="relative" maxW="600px" w="100%">
      <HStack position="absolute" top={2} right={2} zIndex={1}>
        <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
          <IconButton
            aria-label="Copy JSON to clipboard"
            size="xs"
            variant="ghost"
            colorPalette="gray"
            color="gray.300"
            _hover={{ color: 'white', bg: 'gray.700' }}
            onClick={handleCopy}
            borderRadius="full"
          >
            <IconCopy boxSize={4} />
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
