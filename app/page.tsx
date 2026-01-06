import { Box } from '@chakra-ui/react';
import { getLatestImages } from '@/lib/image/queries';
import ImageGridWithSearch from '@/components/ImageGridWithSearch';

export default async function HomePage() {
  const images = await getLatestImages(25);

  return (
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }}>
      <ImageGridWithSearch images={images} />
    </Box>
  );
}
