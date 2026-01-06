'use client';
import { useState, useRef, useCallback } from 'react';
import { Box, Heading, SimpleGrid, Text, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import SearchBox from '@/components/SearchBox';
import { ImageItem } from '@/types/image';

interface Props {
  images: ImageItem[];
}

export default function ImageGridWithSearch({ images }: Props) {
  const [searchActive, setSearchActive] = useState(false);
  const searchBoxRef = useRef<{ reset: () => void }>(null);
  
  const resetSearch = useCallback(() => {
    searchBoxRef.current?.reset();
    setSearchActive(false);
  }, []);
  return (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" mb={8} mt={2}>
        <ChakraLink as={NextLink} href="/" _hover={{ textDecoration: 'none', color: 'teal.200' }} onClick={resetSearch}>
          <Text fontSize="5xl" fontWeight="extralight" mb={4} letterSpacing="tight" textAlign="center">
            SeeVector
          </Text>
        </ChakraLink>
        <SearchBox onActiveChange={setSearchActive} ref={searchBoxRef} />
      </Box>
      {!searchActive && (
        <>
          <Heading size="lg" mb={6}>Latest Images</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
            {images.map((img) => (
              <Box key={img._id} boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
                <ImagePreview
                  id={img._id}
                  title={img.title}
                  description={img.description}
                />
                <Box p={3}>
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
        </>
      )}
    </Box>
  );
} 