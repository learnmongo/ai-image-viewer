import { getImagesByHue } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import { ImageGridCard } from '@/components/ImageGridCard';
import {
  IMAGE_GRID_COLUMNS,
  MOBILE_CONTENT_PX,
  MOBILE_PAGE_PX,
} from '@/lib/layout/mobile';

interface HuePageProps {
  params: Promise<{ hue: string }>;
}

export default async function HuePage({ params }: HuePageProps) {
  const { hue: hueParam } = await params;
  const hue = hueParam.replace(/-/g, ' ');
  const images = await getImagesByHue(hue);

  return (
    <Box px={MOBILE_PAGE_PX} py={{ base: 4, md: 8, lg: 12 }}>
      <Heading size="lg" mb={6} px={MOBILE_CONTENT_PX}>
        Images with hue &quot;{hue}&quot;
      </Heading>
      {images.length === 0 ? (
        <Text px={MOBILE_CONTENT_PX}>No images found for this hue.</Text>
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
