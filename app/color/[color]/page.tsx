import { getImagesByColorFuzzy } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import { offsetColor } from '@/lib/image/utils';

export default async function ColorPage({ params }: { params: { color: string } }) {
  const threshold = 60;
  const images = await getImagesByColorFuzzy(params.color, threshold);

  const color = params.color.startsWith('#') ? params.color : `#${params.color}`;
  const startColor = offsetColor(color, -30);
  const endColor = offsetColor(color, 30);
  const background = `linear-gradient(135deg, ${startColor}, ${color}, ${endColor})`;

  return (
    <Box bg={background} minH="100vh" px={[2, 4, 8]} py={[4, 8, 12]}>
      <Heading size="lg" mb={6}>Images with color &quot;{params.color}&quot; (threshold: {threshold})</Heading>
      {images.length === 0 ? (
        <Text>No images found for this color.</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
          {images.map((img) => (
            <ImagePreview
              key={img._id.toString()}
              id={img._id.toString()}
              title={img.title}
              summary={img.summary}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
} 