import { ImageGridCard } from '@/components/ImageGridCard';
import ImageMetadata from '@/components/ImageMetadata';
import ImagePreview from '@/components/ImagePreview';
import { getImagesByTag } from '@/lib/image/queries';
import { IMAGE_GRID_COLUMNS, MOBILE_CONTENT_PX, MOBILE_PAGE_PX } from '@/lib/layout/mobile';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagParam } = await params;
  const tag = tagParam.replace(/-/g, ' ');
  const images = await getImagesByTag(tag);

  return (
    <Box px={MOBILE_PAGE_PX} py={{ base: 4, md: 8, lg: 12 }}>
      <Heading size="lg" mb={6} px={MOBILE_CONTENT_PX}>
        Images tagged &quot;{tag}&quot;
      </Heading>
      {images.length === 0 ? (
        <Text px={MOBILE_CONTENT_PX}>No images found for this tag.</Text>
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
