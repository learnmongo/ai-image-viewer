import { getImagesByColorFuzzy } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import { offsetColor } from '@/lib/image/utils';

interface ColorPageProps {
  params: Promise<{ color: string }>;
}

export default async function ColorPage({ params }: ColorPageProps) {
  const { color: colorParam } = await params;
  const threshold = 60;
  const images = await getImagesByColorFuzzy(colorParam, threshold);

  const color = colorParam.startsWith('#') ? colorParam : `#${colorParam}`;
  const startColor = offsetColor(color, -30);
  const endColor = offsetColor(color, 30);
  const background = `linear-gradient(135deg, ${startColor}, ${color}, ${endColor})`;

  return (
    <Box bg={background} minH="100vh" px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }}>
      <Heading size="lg" mb={6}>Images with color &quot;{colorParam}&quot; (threshold: {threshold})</Heading>
      {images.length === 0 ? (
        <Text>No images found for this color.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
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