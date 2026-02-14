import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MenonTrucks - Commercial Vehicle Marketplace',
  description:
    'Buy and sell commercial vehicles with confidence. MenonTrucks is India\'s trusted marketplace for trucks, buses, and commercial vehicles.',
  keywords: [
    'trucks',
    'commercial vehicles',
    'buy trucks',
    'sell trucks',
    'marketplace',
    'MenonTrucks',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
