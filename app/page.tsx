import { Box, Heading, SimpleGrid, Wrap, Badge } from '@chakra-ui/react';
import Link from 'next/link';
import ImagePreview from '@/components/ImagePreview';
import { getLatestImages } from '@/lib/image/queries';
import { ImageDoc } from '@/types/image';

export default async function HomePage() {
  const images: ImageDoc[] = await getLatestImages(25);

  return (
    <Box px={[2, 4, 8]} py={[4, 8, 12]}>
      <Heading size="lg" mb={6}>Latest Images</Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
        {images.map((img) => (
          <Box key={img._id.toString()} boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
            <ImagePreview
              id={img._id.toString()}
              title={img.title}
              summary={img.summary}
            />
            <Box p={3}>
              <Wrap gap={2} align="center">
                {img.tags?.slice(0, 1).map((tag: string) => (
                  <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
                    <Badge colorScheme="whiteAlpha" fontSize="xs" px={3} py={1} cursor="pointer" _hover={{ bg: 'whiteAlpha.300' }} transition="background 0.2s">{tag}</Badge>
                  </Link>
                ))}
                {img.feelings?.slice(0, 1).map((feeling: string) => (
                  <Link key={feeling} href={`/feeling/${encodeURIComponent(feeling)}`}>
                    <Badge colorScheme="yellow" fontSize="xs" px={3} py={1} cursor="pointer" _hover={{ bg: 'yellow.400' }} transition="background 0.2s">{feeling}</Badge>
                  </Link>
                ))}
                {img.colors?.slice(0, 3).map((color: string) => (
                  <Link key={color} href={`/color/${encodeURIComponent(color)}`}>
                    <Box w="18px" h="18px" borderRadius="full" bg={color} border="1px solid white" title={color} cursor="pointer" _hover={{ transform: 'scale(1.1)' }} transition="transform 0.2s" />
                  </Link>
                ))}
              </Wrap>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
