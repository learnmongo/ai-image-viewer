import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { getLatestImages } from '@/lib/image/queries';
import { ImageDoc } from '@/types/image';
import ImageGridWithSearch from '@/components/ImageGridWithSearch';

export default async function HomePage() {
  const images: ImageDoc[] = await getLatestImages(25);

  return (
    <Box px={[2, 4, 8]} py={[4, 8, 12]}>
      <ImageGridWithSearch images={images} />
    </Box>
  );
}
