'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { ListingCardSkeleton } from '@/components/listings/listing-card-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { Pagination } from '@/components/common/pagination';
import { useFavoritesStore } from '@/store/favorites';
import { useAuthStore } from '@/store/auth';
import { getImagesForListing } from '@/lib/images';

// Fallback dummy favorites when API is unavailable
const dummyFavorites: ListingCardData[] = [
  {
    id: '1',
    slug: 'mercedes-actros-2545-ls-2022',
    title: 'Mercedes-Benz Actros 2545 LS 6x2',
    price: 89500,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('Mercedes-Benz Actros 2545 LS 6x2'),
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
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('Volvo FH 500 4x2 Globetrotter XL'),
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
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('Scania R 450 A4x2NA Highline'),
    year: 2021,
    mileage: 310000,
    fuelType: 'Diesel',
    location: { city: 'Antwerp', country: 'Belgium' },
    seller: { name: 'FleetPro NV' },
    isFeatured: false,
  },
];

function mapFavoriteToCard(fav: any): ListingCardData {
  const l = fav.listing;
  let images: string[] = [];
  if (l.images?.length > 0) {
    images = l.images.map((img: any) => img.mediumUrl || img.thumbnailUrl || img.originalUrl).filter(Boolean);
  }
  if (images.length === 0) {
    images = getImagesForListing(l.title || '');
  }
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    price: l.price ? Number(l.price) : 0,
    currency: l.priceCurrency || 'USD',
    condition: l.condition || 'USED',
    images,
    year: l.year,
    mileage: l.mileageKm,
    fuelType: l.fuelType,
    location: { city: l.city || '', country: l.countryCode || '' },
    seller: { name: 'Dealer' },
    isFeatured: false,
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites, isLoading, pagination } = useFavoritesStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites(page);
    }
  }, [isAuthenticated, page, fetchFavorites]);

  // Map API favorites to card data, fall back to dummy
  const displayListings: ListingCardData[] =
    favorites.length > 0
      ? favorites.map(mapFavoriteToCard)
      : dummyFavorites;

  const totalCount = pagination.total || displayListings.length;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} saved {totalCount === 1 ? 'listing' : 'listings'}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
