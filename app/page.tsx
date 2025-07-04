import { Box, Heading, SimpleGrid, Input, InputGroup, Text } from '@chakra-ui/react';
import ImagePreview from '@/components/ImagePreview';
import ImageMetadata from '@/components/ImageMetadata';
import { getLatestImages } from '@/lib/image/queries';
import { ImageDoc } from '@/types/image';

export default async function HomePage() {
  const images: ImageDoc[] = await getLatestImages(25);

  return (
    <Box px={[2, 4, 8]} py={[4, 8, 12]}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={8} mt={2}>
        <Text fontSize="5xl" fontWeight="extralight" mb={4} letterSpacing="tight" textAlign="center">
          SeeVector
        </Text>
        <InputGroup maxW="600px" w="100%">
          <Input
            placeholder="What sort of things do you want to see?"
            bg="whiteAlpha.800"
            _placeholder={{ color: 'blackAlpha.500', fontSize: 'lg' }}
            _focus={{ bg: 'whiteAlpha.900', borderColor: 'whiteAlpha.300', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
            color="gray.900"
            borderRadius="xl"
            borderWidth="1.5px"
            borderColor="whiteAlpha.400"
            boxShadow="lg"
            fontSize="xl"
            fontWeight="normal"
            textAlign="center"
            px={8}
            py={6}
          />
        </InputGroup>
      </Box>
      <Heading size="lg" mb={6}>Latest Images</Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
        {images.map((img) => (
          <Box key={img._id.toString()} boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
            <ImagePreview
              id={img._id.toString()}
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
    </Box>
  );
}
