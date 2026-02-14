import Link from 'next/link';
import { Truck, ArrowLeft, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Truck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! The page you&apos;re looking for seems to have driven away.
          It might have been moved, deleted, or never existed.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button variant="accent" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search Vehicles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
