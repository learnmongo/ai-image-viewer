import { ImageCardThumbnail } from '@/components/ImageCardThumbnail';
import { ImageGridCard } from '@/components/ImageGridCard';
import { slugify } from '@/lib/utils/slugify';
import { Badge, Box, Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { shouldShowTextSearchScoreBadge } from './searchScoreThresholds';
import type { SearchResult } from './types';

interface SearchResultCardProps {
  img: SearchResult;
  rankIndex: number;
  total: number;
  hybrid: boolean;
}

export function SearchResultCard({ img, rankIndex, total, hybrid }: SearchResultCardProps) {
  const slug = slugify(img.title, img._id);
  const showBadge = hybrid || shouldShowTextSearchScoreBadge(img.score);
  const badgeLabel = hybrid
    ? total <= 1
      ? 'Best match'
      : `Rank ${rankIndex + 1} of ${total}`
    : typeof img.score === 'number'
      ? `Score ${img.score.toFixed(3)}`
      : null;

  return (
    <ChakraLink
      as={NextLink}
      href={`/view/${slug}`}
      _hover={{ textDecoration: 'none', bg: 'whiteAlpha.200' }}
      borderRadius={{ base: 0, sm: 'lg' }}
      display="block"
      h="100%"
      aria-label={`View ${img.title}`}
    >
      <ImageGridCard>
        <ImageCardThumbnail id={img._id} title={img.title} />
        <Box p={3} color="white" flexGrow={1}>
          <Text
            fontWeight="bold"
            fontSize="md"
            mb={1}
            color="white"
            textShadow="0 1px 3px rgba(0, 0, 0, 0.5)"
          >
            {img.title}
          </Text>
          {img.summary && (
            <Text
              fontSize="sm"
              color="whiteAlpha.900"
              mb={2}
              textShadow="0 1px 2px rgba(0, 0, 0, 0.5)"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {img.summary}
            </Text>
          )}
          {showBadge && badgeLabel != null && (
            <Badge
              as="span"
              display="inline-block"
              w="fit-content"
              mt={1}
              fontSize="xs"
              fontWeight="semibold"
              px={2.5}
              py={0.5}
              borderRadius="full"
              bg="whiteAlpha.200"
              color="white"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              textTransform="none"
              textShadow="0 1px 2px rgba(0, 0, 0, 0.35)"
            >
              {badgeLabel}
            </Badge>
          )}
        </Box>
      </ImageGridCard>
    </ChakraLink>
  );
}
