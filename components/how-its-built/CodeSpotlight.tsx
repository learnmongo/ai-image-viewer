import { GLASS_CARD_NESTED } from '@/components/glass-styles';
import { Box, Code, Text } from '@chakra-ui/react';

interface CodeSpotlightProps {
  filePath: string;
  code: string;
}

export function CodeSpotlight({ filePath, code }: CodeSpotlightProps) {
  return (
    <Box mt={4} mb={4} overflow="hidden" {...GLASS_CARD_NESTED}>
      <Box px={4} py={2} borderBottom="1px solid" borderColor="whiteAlpha.200">
        <Text fontSize="xs" color="whiteAlpha.600" fontFamily="mono">
          {filePath}
        </Text>
      </Box>
      <Code
        as="pre"
        display="block"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        fontSize="sm"
        fontFamily="mono"
        bg="transparent"
        color="whiteAlpha.900"
        p={4}
        m={0}
      >
        {code}
      </Code>
    </Box>
  );
}
