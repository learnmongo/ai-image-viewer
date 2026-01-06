'use client';
import { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Box, Input, InputGroup, Text, Spinner, SimpleGrid, Image } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { slugify } from '@/lib/utils/slugify';
import { SearchResult } from '@/types/image';

interface SearchBoxProps {
  onActiveChange?: (active: boolean) => void;
}

interface SearchBoxHandle {
  reset: () => void;
}

const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>(function SearchBox({ onActiveChange }, ref) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Reset search state when navigating to home page
  useEffect(() => {
    if (pathname === '/') {
      setQuery('');
      setResults(null);
      setError(null);
      setLoading(false);
    }
  }, [pathname]);

  // Update parent about search state
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(!!query && query.length >= 3 && !!results);
    }
  }, [query, results, onActiveChange]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setQuery('');
      setResults(null);
      setError(null);
      setLoading(false);
    }
  }));

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If query is too short, clear results
    if (query.length < 3) {
      setResults(null);
      setLoading(false);
      return;
    }

    // Set up debounced search
    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, 500); // Wait 500ms after user stops typing

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, performSearch]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    await performSearch(query);
  }, [query, performSearch]);

  return (
    <Box w="100%" display="flex" flexDirection="column" alignItems="center" mb={8} mt={2}>
      <Box maxW="600px" w="100%">
        <form onSubmit={handleSearch} style={{ width: '100%' }} aria-label="Search form">
          <InputGroup w="100%">
            <Input
              placeholder="What sort of things do you want to see?"
              bg="whiteAlpha.800"
              _placeholder={{ color: 'blackAlpha.500', fontSize: 'lg' }}
              _focus={{ 
                bg: 'whiteAlpha.900', 
                borderColor: 'whiteAlpha.300', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.10)' 
              }}
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              aria-label="Search images"
            />
          </InputGroup>
        </form>
        {error && (
          <Text color="red.400" mt={4} role="alert">
            {error}
          </Text>
        )}
        {loading && <Spinner size="lg" mt={4} />}
      </Box>
      {results && results.length > 0 && (
        <Box maxW="1200px" w="100%" mt={8}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} w="100%">
            {results.map((img) => {
              const id = img._id.toString();
              const slug = slugify(img.title, id);
              return (
                <ChakraLink
                  as={NextLink}
                  href={`/view/${slug}`}
                  _hover={{ textDecoration: 'none', bg: 'whiteAlpha.200' }}
                  key={id}
                  borderRadius="lg"
                  display="block"
                  aria-label={`View ${img.title}`}
                >
                  <Box boxShadow="md" borderRadius="lg" overflow="hidden" bg="blackAlpha.700">
                    <Box>
                      <Image
                        src={`/resources/${id}.jpg`}
                        alt={img.title}
                        width="100%"
                        height="200px"
                        objectFit="cover"
                        display="block"
                        borderTopLeftRadius="8px"
                        borderTopRightRadius="8px"
                        loading="lazy"
                      />
                    </Box>
                    <Box p={3}>
                      <Text fontWeight="bold" fontSize="md" mb={1}>{img.title}</Text>
                      {img.summary && (
                        <Text fontSize="sm" color="whiteAlpha.700" mb={2} noOfLines={2}>
                          {img.summary}
                        </Text>
                      )}
                      {typeof img.score !== 'undefined' && (
                        <Text fontSize="xs" color="teal.200">
                          Score: {img.score.toFixed(3)}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </ChakraLink>
              );
            })}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
});

export default SearchBox; 