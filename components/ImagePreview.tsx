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
      display="block"
      width="100%"
      height="100%"
    >
      <Box 
        width="100%" 
        aspectRatio={16 / 9}
        overflow="hidden"
        flexShrink={0}
        borderTopRadius="lg"
      >
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
      <Box p={3} color="white">
        <Text 
          fontWeight="bold" 
          fontSize="md" 
          overflow="hidden" 
          textOverflow="ellipsis" 
          whiteSpace="nowrap"
          mb={1}
          color="white"
          textShadow="0 1px 3px rgba(0, 0, 0, 0.5)"
        >
          {title}
        </Text>
        {description && (
          <Text 
            fontSize="sm" 
            color="whiteAlpha.900" 
            overflow="hidden" 
            textOverflow="ellipsis" 
            whiteSpace="normal" 
            maxH="2.5em" 
            lineHeight="1.25em"
            textShadow="0 1px 2px rgba(0, 0, 0, 0.5)"
          >
            {description}
          </Text>
        )}
      </Box>
    </ChakraLink>
  );
};

export default ImagePreview; 