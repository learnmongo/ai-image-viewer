import { getImagesByColorFuzzy } from '@/lib/image/queries';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import { ImageGridCard } from '@/components/ImageGridCard';
import { offsetColor } from '@/lib/image/utils';
import {
  IMAGE_GRID_COLUMNS,
  MOBILE_CONTENT_PX,
  MOBILE_PAGE_PX,
} from '@/lib/layout/mobile';

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
    <Box bg={background} minH="100vh" px={MOBILE_PAGE_PX} py={{ base: 4, md: 8, lg: 12 }}>
      <Heading size="lg" mb={6} px={MOBILE_CONTENT_PX}>
        Images with color &quot;{colorParam}&quot; (threshold: {threshold})
      </Heading>
      {images.length === 0 ? (
        <Text px={MOBILE_CONTENT_PX}>No images found for this color.</Text>
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
