import { getImagesByFeeling } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';

interface FeelingPageProps {
  params: Promise<{ feeling: string }>;
}

export default async function FeelingPage({ params }: FeelingPageProps) {
  const { feeling: feelingParam } = await params;
  const feeling = feelingParam.replace(/-/g, ' ');
  const images = await getImagesByFeeling(feeling);

  return (
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }}>
      <Heading size="lg" mb={6}>Images with feeling &quot;{feeling}&quot;</Heading>
      {images.length === 0 ? (
        <Text>No images found for this feeling.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
          {images.map((img) => (
            <Box 
              key={img._id.toString()} 
              borderRadius="lg" 
              overflow="hidden" 
              bg="rgba(255, 255, 255, 0.18)"
              backdropFilter="blur(24px) saturate(180%)"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              boxShadow="2xl"
              height="100%"
              display="flex"
              flexDirection="column"
              transition="all 0.2s ease"
              _hover={{
                boxShadow: '2xl',
                borderColor: 'whiteAlpha.300',
              }}
            >
              <ImagePreview
                id={img._id.toString()}
                title={img.title}
                description={img.description}
              />
              <Box p={3} flexGrow={1}>
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