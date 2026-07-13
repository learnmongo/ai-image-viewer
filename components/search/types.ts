import type { ImageItem } from '@/types/image';

export interface SearchResult extends ImageItem {
  score?: number;
}
