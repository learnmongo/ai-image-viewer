'use client';
import { useState } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import SearchBox from '@/components/SearchBox';
import HowItsBuiltPromo from '@/components/HowItsBuiltPromo';
import { useEagerGridCount } from '@/hooks/useEagerGridCount';
import { ImageItem } from '@/types/image';

interface Props {
  images: ImageItem[];
}

export default function ImageGridWithSearch({ images }: Props) {
  const [searchActive, setSearchActive] = useState(false);
  const eagerCount = useEagerGridCount();

  return (
    <Box maxW="1280px" mx="auto" w="100%">
      <SearchBox onActiveChange={setSearchActive} />
      {!searchActive && (
        <SimpleGrid w="100%" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} mt={4}>
          {images.map((img, index) => (
            <Box
              key={img._id}
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
                id={img._id}
                title={img.title}
                description={img.description}
                eager={index < eagerCount}
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
      {!searchActive && <HowItsBuiltPromo />}
    </Box>
  );
} 