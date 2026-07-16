import { Box } from '@chakra-ui/react';
import { getLatestImages } from '@/lib/image/queries';
import { toImageArray } from '@/lib/image/utils';
import ImageGridWithSearch from '@/components/ImageGridWithSearch';

/** Homepage reads from MongoDB — don't bake an empty grid at build time. */
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const images = await getLatestImages(25);
  const imageList = toImageArray(images);

  const background =
    'linear-gradient(155deg, #04060a 0%, #0a0f18 28%, #0d1524 52%, #080c14 78%, #05070c 100%)';

  return (
    <Box 
      minH="100vh"
      bg={background}
      px={{ base: 2, md: 4, lg: 8 }} 
      pt={0}
      pb={{ base: 4, md: 8, lg: 12 }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(ellipse 80% 60% at 15% 40%, rgba(30, 41, 59, 0.45) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 75%, rgba(15, 23, 42, 0.4) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Box position="relative" zIndex={1}>
        <ImageGridWithSearch images={imageList} />
      </Box>
    </Box>
  );
}
