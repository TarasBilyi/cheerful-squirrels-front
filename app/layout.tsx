import type { Metadata } from 'next';
import { Manrope, Merienda } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ModalRoot from '@/components/ModalRoot';
import { Toaster } from 'react-hot-toast';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const merienda = Merienda({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-merienda',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Harmonic',
  description: 'Find your harmony in community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${merienda.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <div id="modal-root"></div>
        <ModalRoot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#111',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
