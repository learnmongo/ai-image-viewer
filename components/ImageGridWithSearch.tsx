'use client';

import HowItsBuiltPromo from '@/components/HowItsBuiltPromo';
import { ImageGridCard } from '@/components/ImageGridCard';
import ImageMetadata from '@/components/ImageMetadata';
import ImagePreview from '@/components/ImagePreview';
import SearchBox from '@/components/SearchBox';
import { useEagerGridCount } from '@/hooks/useEagerGridCount';
import { IMAGE_GRID_COLUMNS, MOBILE_CONTENT_PX } from '@/lib/layout/mobile';
import { ImageItem } from '@/types/image';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';

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
        <SimpleGrid w="100%" columns={IMAGE_GRID_COLUMNS} gap={6} mt={4}>
          {images.map((img, index) => (
            <ImageGridCard key={img._id}>
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
            </ImageGridCard>
          ))}
        </SimpleGrid>
      )}
      {!searchActive && (
        <Box px={MOBILE_CONTENT_PX}>
          <HowItsBuiltPromo />
        </Box>
      )}
    </Box>
  );
}
