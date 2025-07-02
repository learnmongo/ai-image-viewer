import { Providers } from './providers';
import { Rubik } from 'next/font/google';
import './globals.css';

const rubik = Rubik({ subsets: ['latin'], weight: ['300', '400', '700', '900'] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rubik.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

