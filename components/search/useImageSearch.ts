'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { SearchResult } from './types';

const MIN_QUERY_LEN = 3;
const DEBOUNCE_MS = 700;

export function useImageSearch(onActiveChange?: (active: boolean) => void) {
  const [query, setQuery] = useState('');
  const [hybrid, setHybrid] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setQuery('');
    setHybrid(false);
    setResults(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      reset();
    }
  }, [pathname, reset]);

  useEffect(() => {
    onActiveChange?.(!!query && query.length >= MIN_QUERY_LEN && !!results);
  }, [query, results, onActiveChange]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < MIN_QUERY_LEN) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, hybrid }),
      });
      const data: { results?: SearchResult[] } = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } finally {
      setLoading(false);
    }
  }, [hybrid]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.length < MIN_QUERY_LEN) {
      setResults(null);
      setLoading(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, performSearch]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      await performSearch(query);
    },
    [query, performSearch],
  );

  const suggestHybrid =
    !hybrid &&
    query.length >= MIN_QUERY_LEN &&
    results !== null &&
    results.length === 0 &&
    !loading;

  return {
    query,
    setQuery,
    hybrid,
    setHybrid,
    results,
    loading,
    suggestHybrid,
    handleSearch,
    reset,
  };
}
