import type { Metadata, Viewport } from 'next';
import { Manrope, Merienda } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import css from './page.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ModalRoot from '@/components/ModalRoot/ModalRoot';
import { Toaster } from 'react-hot-toast';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import Loader from '@/components/Loader/Loader';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/lib/seo';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find your harmony in community`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['articles', 'blog', 'writing', 'community', 'harmoniq'],
  icons: {
    icon: '/favicon.ico',
    // TODO: add public/apple-touch-icon.png (180x180) and uncomment:
    // apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Find your harmony in community`,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#374f42',
};

// Sets data-theme on <html> before React hydrates, so the page never
// paints with the wrong theme for a frame (no flash of light theme
// for a returning dark-mode user).
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('harmoniq-theme');
    var theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${merienda.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <TanStackProvider>
            <AuthProvider>
              <Header />
              <main className={css.main}>{children}</main>
              <Footer />
              <div id="modal-root"></div>
              <ModalRoot />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#374f42',
                    color: '#fff',
                  },
                }}
              />
              <Loader />
            </AuthProvider>
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
