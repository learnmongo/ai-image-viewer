/**
 * Fields passed to `$search` … `path` for keyword matching.
 * Hybrid and text-only search both use this list so “what’s searchable” stays in one place.
 */
export const ATLAS_TEXT_SEARCH_PATHS = ['title', 'description', 'summary', 'tags'] as const;
