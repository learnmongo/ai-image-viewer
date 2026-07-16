'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { ReactNode, useState } from 'react';

export function EmotionCacheProvider({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const emotionCache = createCache({ key: 'chakra', prepend: true });
    emotionCache.compat = true;
    return emotionCache;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
