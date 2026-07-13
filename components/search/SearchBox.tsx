'use client';

import { Box, Spinner } from '@chakra-ui/react';
import { SearchInputBar } from './SearchInputBar';
import { SearchResultsGrid } from './SearchResultsGrid';
import { SearchSuggestHybrid } from './SearchSuggestHybrid';
import { useImageSearch } from './useImageSearch';

interface SearchBoxProps {
  onActiveChange?: (active: boolean) => void;
}

const FIXED_SEARCH_PADDING_TOP = 'max(1.25rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))';

const SearchBox = ({ onActiveChange }: SearchBoxProps) => {
  const search = useImageSearch(onActiveChange);

  return (
    <Box w="100%" display="flex" flexDirection="column" alignItems="center" position="relative">
      {/* Only the pill: fixed so the page always scrolls underneath; no full-width bar or backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1100}
        pb={3}
        px={{ base: 3, md: 5, lg: 8 }}
        style={{
          paddingTop: FIXED_SEARCH_PADDING_TOP,
        }}
        display="flex"
        justifyContent="center"
        pointerEvents="none"
        bg="transparent"
      >
        <Box maxW="720px" w="100%" pointerEvents="auto">
          <SearchInputBar
            query={search.query}
            hybrid={search.hybrid}
            loading={search.loading}
            onQueryChange={search.setQuery}
            onHybridToggle={() => search.setHybrid((v) => !v)}
            onSubmit={search.handleSearch}
          />
        </Box>
      </Box>

      {/* Same vertical stack as the fixed row: padTop + ~input row + pb — avoids gap from mismatched px vs fixed */}
      <Box
        w="100%"
        flexShrink={0}
        aria-hidden
        style={{
          minHeight: `calc(${FIXED_SEARCH_PADDING_TOP} + 3.75rem + 0.75rem)`,
        }}
      />

      {search.suggestHybrid && (
        <Box maxW="720px" w="100%" mt={2}>
          <SearchSuggestHybrid onEnableHybrid={() => search.setHybrid(true)} />
        </Box>
      )}

      {search.results && search.results.length > 0 && (
        <Box w="100%" maxW="1280px" alignSelf="stretch">
          <SearchResultsGrid results={search.results} hybrid={search.hybrid} />
        </Box>
      )}

      {search.loading && (
        <Box
          position="fixed"
          inset={0}
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          aria-busy="true"
          aria-live="polite"
        >
          <Spinner size="xl" color="white" borderWidth="3px" />
        </Box>
      )}
    </Box>
  );
};

export default SearchBox;
