import { getImagesByFeeling } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import { ImageGridCard } from '@/components/ImageGridCard';
import {
  IMAGE_GRID_COLUMNS,
  MOBILE_CONTENT_PX,
  MOBILE_PAGE_PX,
} from '@/lib/layout/mobile';

interface FeelingPageProps {
  params: Promise<{ feeling: string }>;
}

export default async function FeelingPage({ params }: FeelingPageProps) {
  const { feeling: feelingParam } = await params;
  const feeling = feelingParam.replace(/-/g, ' ');
  const images = await getImagesByFeeling(feeling);

  return (
    <Box px={MOBILE_PAGE_PX} py={{ base: 4, md: 8, lg: 12 }}>
      <Heading size="lg" mb={6} px={MOBILE_CONTENT_PX}>
        Images with feeling &quot;{feeling}&quot;
      </Heading>
      {images.length === 0 ? (
        <Text px={MOBILE_CONTENT_PX}>No images found for this feeling.</Text>
      ) : (
        <SimpleGrid columns={IMAGE_GRID_COLUMNS} gap={6}>
          {images.map((img) => (
            <ImageGridCard key={img._id.toString()}>
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
            </ImageGridCard>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
