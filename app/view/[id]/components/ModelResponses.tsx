import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { RawModelResponse } from '@/types/image';

interface ModelResponsesProps {
  responses: RawModelResponse[];
}

const ModelResponses = ({ responses }: ModelResponsesProps) => {
  if (!responses || responses.length === 0) return null;
  return (
    <Box mt={8} w="100%">
      <Box mb={4} h="1px" bg="whiteAlpha.400" w="100%" />
      <Heading size="md" mb={2} fontWeight="bold">Model Responses</Heading>
      <Stack gap={4}>
        {responses.map((r, i) => (
          <Box key={i} bg="whiteAlpha.200" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="sm" color="whiteAlpha.800" fontWeight="bold" mb={1}>{r.model}</Text>
            <Text fontSize="sm" color="whiteAlpha.900" whiteSpace="pre-line">{r.response}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ModelResponses; 