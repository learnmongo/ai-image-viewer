import { Box, Text, Link as ChakraLink, Image } from '@chakra-ui/react';
import NextLink from 'next/link';

interface ImagePreviewProps {
  id: string;
  title: string;
  summary?: string;
}

const ImagePreview = ({ id, title, summary }: ImagePreviewProps) => (
  <ChakraLink as={NextLink} href={`/view/${id}`} _hover={{ textDecoration: 'none' }}>
    <Box boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
      <Image
        src={`/resources/${id}.jpg`}
        alt={title}
        width="100%"
        height="200px"
        objectFit="cover"
        display="block"
        borderTopRadius="lg"
      />
      <Box p={3}>
        <Text fontWeight="bold" fontSize="md" truncate>{title}</Text>
        {summary && <Text fontSize="sm" color="whiteAlpha.700" truncate>{summary}</Text>}
      </Box>
    </Box>
  </ChakraLink>
);

export default ImagePreview; 