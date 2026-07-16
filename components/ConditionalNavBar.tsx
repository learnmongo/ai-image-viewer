'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar';
import ViewHomeChrome from '@/components/ViewHomeChrome';

/** `/` uses fixed search only; `/view/*` and `/how-its-built` use a glass home chip; other routes keep the full bar. */
export default function ConditionalNavBar() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  if (pathname.startsWith('/view/') || pathname === '/how-its-built') {
    return <ViewHomeChrome />;
  }
  return <NavBar />;
}
