import { Box, Image } from '@chakra-ui/react';

/** Shared by homepage and search so image area scales identically with grid column width. */
export const IMAGE_CARD_ASPECT_RATIO = 16 / 9;

interface ImageCardThumbnailProps {
  id: string;
  title: string;
}

export function ImageCardThumbnail({ id, title }: ImageCardThumbnailProps) {
  return (
    <Box
      width="100%"
      aspectRatio={IMAGE_CARD_ASPECT_RATIO}
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
  );
}
