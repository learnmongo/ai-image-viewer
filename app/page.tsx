import { Box } from '@chakra-ui/react';
import { getLatestImages } from '@/lib/image/queries';
import { toImageArray } from '@/lib/image/utils';
import ImageGridWithSearch from '@/components/ImageGridWithSearch';

export default async function HomePage() {
  const images = await getLatestImages(25);
  const imageList = toImageArray(images);

  return (
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }}>
      <ImageGridWithSearch images={imageList} />
    </Box>
  );
}
