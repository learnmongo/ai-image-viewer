import { Box, SimpleGrid } from '@chakra-ui/react';
import { SearchResultCard } from './SearchResultCard';
import type { SearchResult } from './types';

interface SearchResultsGridProps {
  results: SearchResult[];
  hybrid: boolean;
}

export function SearchResultsGrid({ results, hybrid }: SearchResultsGridProps) {
  if (!results.length) {
    return null;
  }

  return (
    <Box w="100%" mt={8} alignSelf="stretch">
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} w="100%">
        {results.map((img, rankIndex) => (
          <SearchResultCard
            key={img._id}
            img={img}
            rankIndex={rankIndex}
            total={results.length}
            hybrid={hybrid}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
