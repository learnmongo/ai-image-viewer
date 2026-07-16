import { Box, Code, Text } from '@chakra-ui/react';

interface CodeSpotlightProps {
  filePath: string;
  code: string;
}

export function CodeSpotlight({ filePath, code }: CodeSpotlightProps) {
  return (
    <Box
      mt={4}
      mb={4}
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bg="rgba(0, 0, 0, 0.35)"
    >
      <Box px={4} py={2} bg="rgba(0, 0, 0, 0.25)" borderBottom="1px solid" borderColor="whiteAlpha.100">
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
