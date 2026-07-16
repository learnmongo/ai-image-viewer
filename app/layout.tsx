import ConditionalNavBar from '@/components/ConditionalNavBar';
import SiteFooter from '@/components/SiteFooter';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | AI Image Search',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'AI image search',
    'MongoDB',
    'vector search',
    'MongoDB Search',
    'SeeMongo',
    'LearnMongo',
    'semantic search',
    'photo search',
  ],
  authors: [{ name: 'Justin Jenkins', url: 'https://justinjenkins.net' }],
  creator: 'Justin Jenkins',
  publisher: 'LearnMongo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
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
