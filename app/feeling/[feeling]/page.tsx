import { getImagesByFeeling } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';

export default async function FeelingPage({ params }: { params: { feeling: string } }) {
  const images = await getImagesByFeeling(params.feeling);

  return (
    <Box px={[2, 4, 8]} py={[4, 8, 12]}>
      <Heading size="lg" mb={6}>Images with feeling &quot;{params.feeling}&quot;</Heading>
      {images.length === 0 ? (
        <Text>No images found for this feeling.</Text>
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