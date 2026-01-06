import { Box } from '@chakra-ui/react';
import { getLatestImages } from '@/lib/image/queries';
import { toImageArray } from '@/lib/image/utils';
import ImageGridWithSearch from '@/components/ImageGridWithSearch';

export default async function HomePage() {
  const images = await getLatestImages(25);
  const imageList = toImageArray(images);

  const background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)';

  return (
    <Box 
      minH="100vh"
      bg={background}
      px={{ base: 2, md: 4, lg: 8 }} 
      py={{ base: 4, md: 8, lg: 12 }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(30, 144, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.08) 0%, transparent 50%)',
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
