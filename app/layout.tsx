import ConditionalNavBar from '@/components/ConditionalNavBar';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'SeeMongo - AI Image Search | LearnMongo',
    template: '%s | AI Image Search',
  },
};

const rubik = Rubik({ subsets: ['latin'], weight: ['300', '400', '700', '900'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rubik.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ConditionalNavBar />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
