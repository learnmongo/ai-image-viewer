import { getImagesByTag } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';

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
            <Box key={img._id.toString()} boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
              <ImagePreview
                id={img._id.toString()}
                title={img.title}
                description={img.description}
              />
              <Box p={3}>
                <ImageMetadata 
                  tags={img.tags}
                  feelings={img.feelings}
                  colors={img.colors}
                  tagLimit={1}
                  feelingLimit={1}
                  colorLimit={3}
                />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
} 