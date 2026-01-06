import { Box, Text, Link as ChakraLink, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
import { slugify } from '@/lib/utils/slugify';

interface ImagePreviewProps {
  id: string;
  title: string;
  description?: string;
}

const ImagePreview = ({ id, title, description }: ImagePreviewProps) => {
  const slug = slugify(title, id);
  
  return (
    <ChakraLink 
      as={NextLink} 
      href={`/view/${slug}`} 
      _hover={{ textDecoration: 'none' }}
      aria-label={`View ${title}`}
    >
      <Box boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
        <Box position="relative" width="100%" aspectRatio={16 / 9} maxHeight="300px">
          <Image
            src={`/resources/${id}.jpg`}
            alt={title}
            width="100%"
            height="100%"
            objectFit="cover"
            display="block"
            borderTopRadius="lg"
            loading="lazy"
          />
        </Box>
        <Box p={3}>
          <Text 
            fontWeight="bold" 
            fontSize="md" 
            overflow="hidden" 
            textOverflow="ellipsis" 
            whiteSpace="nowrap"
          >
            {title}
          </Text>
          {description && (
            <Text 
              fontSize="sm" 
              color="whiteAlpha.700" 
              overflow="hidden" 
              textOverflow="ellipsis" 
              whiteSpace="normal" 
              maxH="2.5em" 
              lineHeight="1.25em"
            >
              {description}
            </Text>
          )}
        </Box>
      </Box>
    </ChakraLink>
  );
};

export default ImagePreview; 