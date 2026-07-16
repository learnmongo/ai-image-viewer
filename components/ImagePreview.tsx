'use client';

import { ImageCardThumbnail } from '@/components/ImageCardThumbnail';
import { slugify } from '@/lib/utils/slugify';
import { Box, Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

interface ImagePreviewProps {
  id: string;
  title: string;
  description?: string;
  eager?: boolean;
}

const ImagePreview = ({ id, title, description, eager = false }: ImagePreviewProps) => {
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
      <ImageCardThumbnail id={id} title={title} eager={eager} />
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
