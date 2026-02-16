import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Menon Mobility - Europe\'s Premier Commercial Vehicle Marketplace',
    template: '%s | Menon Mobility',
  },
  description:
    'Buy and sell trucks, trailers, construction equipment, and commercial vehicles on Europe\'s most trusted marketplace. 50,000+ listings from verified dealers in 30+ countries.',
  keywords: [
    'trucks for sale',
    'commercial vehicles',
    'buy trucks Europe',
    'sell trucks online',
    'used trucks marketplace',
    'Menon Mobility',
    'trailers for sale',
    'construction equipment',
    'Mercedes trucks',
    'Volvo trucks',
    'Scania trucks',
    'DAF trucks',
    'MAN trucks',
    'heavy equipment',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Menon Mobility',
    title: 'Menon Mobility - Commercial Vehicle Marketplace',
    description: 'Europe\'s most trusted marketplace for trucks, trailers, and commercial vehicles. 50,000+ listings from 5,000+ verified dealers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menon Mobility - Commercial Vehicle Marketplace',
    description: 'Europe\'s most trusted marketplace for trucks, trailers, and commercial vehicles.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
