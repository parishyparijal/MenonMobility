'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { ListingCardSkeleton } from '@/components/listings/listing-card-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { useFavoritesStore } from '@/store/favorites';
import { useAuthStore } from '@/store/auth';

const dummyFavorites: ListingCardData[] = [
  {
    id: '1',
    slug: 'mercedes-actros-2545-ls-2022',
    title: 'Mercedes-Benz Actros 2545 LS 6x2',
    price: 89500,
    currency: 'EUR',
    condition: 'USED',
    images: [],
    year: 2022,
    mileage: 185000,
    fuelType: 'Diesel',
    location: { city: 'Rotterdam', country: 'Netherlands' },
    seller: { name: 'TransEuropa BV' },
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'volvo-fh-500-2023',
    title: 'Volvo FH 500 4x2 Globetrotter XL',
    price: 125000,
    currency: 'EUR',
    condition: 'USED',
    images: [],
    year: 2023,
    mileage: 95000,
    fuelType: 'Diesel',
    location: { city: 'Hamburg', country: 'Germany' },
    seller: { name: 'Nordic Trucks GmbH' },
    isFeatured: false,
  },
  {
    id: '3',
    slug: 'scania-r450-2021',
    title: 'Scania R 450 A4x2NA Highline',
    price: 78900,
    currency: 'EUR',
    condition: 'USED',
    images: [],
    year: 2021,
    mileage: 310000,
    fuelType: 'Diesel',
    location: { city: 'Antwerp', country: 'Belgium' },
    seller: { name: 'FleetPro NV' },
    isFeatured: false,
  },
];

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { favoriteIds, isLoading } = useFavoritesStore();

  // Filter dummy data to simulate favorites
  const favorited = dummyFavorites.filter((l) => favoriteIds.has(l.id));
  const displayListings = favorited.length > 0 ? favorited : dummyFavorites;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground mt-1">
              {displayListings.length} saved {displayListings.length === 1 ? 'listing' : 'listings'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : displayListings.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Save listings you like by clicking the heart icon. They'll appear here for easy access."
            action={{
              label: 'Browse Listings',
              onClick: () => router.push('/search'),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
