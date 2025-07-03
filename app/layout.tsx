import { Providers } from './providers';
import { Rubik } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const rubik = Rubik({ subsets: ['latin'], weight: ['300', '400', '700', '900'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rubik.className}>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

