import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import { getLatestImages } from '@/lib/image/queries';
import { ImageDoc } from '@/types/image';

export default async function HomePage() {
  const images: ImageDoc[] = await getLatestImages(25);

  return (
    <Box px={[2, 4, 8]} py={[4, 8, 12]}>
      <Heading size="lg" mb={6}>Latest Images</Heading>
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
    </Box>
  );
}
