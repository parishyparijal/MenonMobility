'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg',
        'transform transition-transform duration-500 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground text-center sm:text-left">
          We use cookies to enhance your browsing experience, serve personalized
          ads or content, and analyze our traffic. By clicking &quot;Accept&quot;,
          you consent to our use of cookies.{' '}
          <a href="/privacy" className="text-primary underline hover:no-underline">
            Learn more
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="accent" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
