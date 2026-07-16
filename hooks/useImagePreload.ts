import { useEffect, useState } from 'react';

/** Preload an image URL without adding a DOM node. Handles browser cache. */
export function useImagePreload(src: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.decoding = 'async';

    const finish = () => setLoaded(true);
    img.addEventListener('load', finish);
    img.addEventListener('error', finish);
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      finish();
    }

    return () => {
      img.removeEventListener('load', finish);
      img.removeEventListener('error', finish);
      img.src = '';
    };
  }, [src]);

  return loaded;
}
