import { Box } from '@chakra-ui/react';
import { BlurUpImage } from '@/components/BlurUpImage';

/** Shared by homepage and search so image area scales identically with grid column width. */
export const IMAGE_CARD_ASPECT_RATIO = 16 / 9;

interface ImageCardThumbnailProps {
  id: string;
  title: string;
  eager?: boolean;
}

export function ImageCardThumbnail({ id, title, eager = false }: ImageCardThumbnailProps) {
  return (
    <Box
      width="100%"
      aspectRatio={IMAGE_CARD_ASPECT_RATIO}
      overflow="hidden"
      flexShrink={0}
      borderTopRadius="lg"
    >
      <BlurUpImage id={id} alt={title} variant="grid" eager={eager} />
    </Box>
  );
}
