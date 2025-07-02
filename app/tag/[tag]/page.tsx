import { getImagesByTag } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text, Link as ChakraLink, Image } from '@chakra-ui/react';
import NextLink from 'next/link';

export default async function TagPage({ params }: { params: { tag: string } }) {
  const images = await getImagesByTag(params.tag);

  return (
    <Box px={[2, 4, 8]} py={[4, 8, 12]}>
      <Heading size="lg" mb={6}>Images tagged &quot;{params.tag}&quot;</Heading>
      {images.length === 0 ? (
        <Text>No images found for this tag.</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
          {images.map((img) => (
            <ChakraLink as={NextLink} href={`/view/${img._id.toString()}`} key={img._id.toString()} _hover={{ textDecoration: 'none' }}>
              <Box boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
                <Image
                  src={`/resources/${img._id.toString()}.jpg`}
                  alt={img.title}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  display="block"
                  borderTopRadius="lg"
                />
                <Box p={3}>
                  <Text fontWeight="bold" fontSize="md" truncate>{img.title}</Text>
                  <Text fontSize="sm" color="whiteAlpha.700" truncate>{img.summary}</Text>
                </Box>
              </Box>
            </ChakraLink>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
} 