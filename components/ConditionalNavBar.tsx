'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar';
import ViewHomeChrome from '@/components/ViewHomeChrome';

/** `/` uses fixed search only; `/view/*` uses a glass home chip; other routes keep the full bar. */
export default function ConditionalNavBar() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  if (pathname.startsWith('/view/')) return <ViewHomeChrome />;
  return <NavBar />;
}
