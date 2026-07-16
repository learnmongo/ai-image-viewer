import { useCallback, useEffect, useState } from 'react';

/** Start at primary and fall back once if the image fails to load. */
export function useImageSrcFallback(primary: string, fallback: string) {
  const [src, setSrc] = useState(primary);

  useEffect(() => {
    setSrc(primary);
  }, [primary]);

  const onError = useCallback(() => {
    setSrc((current) => (current === fallback ? current : fallback));
  }, [fallback]);

  return { src, onError };
}
