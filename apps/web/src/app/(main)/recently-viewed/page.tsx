'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Clock } from 'lucide-react';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { EmptyState } from '@/components/common/empty-state';
import { getImagesForListing } from '@/lib/images';

const dummyRecentlyViewed: (ListingCardData & { viewedAt: string })[] = [
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
    viewedAt: '2 minutes ago',
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
    viewedAt: '15 minutes ago',
  },
  {
    id: '3',
    slug: 'cat-320-gc-excavator',
    title: 'Caterpillar 320 GC Excavator',
    price: 165000,
    currency: 'USD',
    condition: 'NEW',
    images: getImagesForListing('Caterpillar 320 GC Excavator'),
    year: 2024,
    fuelType: 'Diesel',
    location: { city: 'Munich', country: 'Germany' },
    seller: { name: 'BavariaTruck AG' },
    isFeatured: false,
    viewedAt: '1 hour ago',
  },
  {
    id: '4',
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
    viewedAt: '3 hours ago',
  },
  {
    id: '5',
    slug: 'daf-xf-480-2022',
    title: 'DAF XF 480 FT Space Cab',
    price: 92000,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('DAF XF 480 FT Space Cab'),
    year: 2022,
    mileage: 210000,
    fuelType: 'Diesel',
    location: { city: 'Eindhoven', country: 'Netherlands' },
    seller: { name: 'DutchFleet BV' },
    isFeatured: false,
    viewedAt: 'Yesterday',
  },
  {
    id: '6',
    slug: 'man-tgx-18510-2023',
    title: 'MAN TGX 18.510 4x2 BLS',
    price: 115000,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('MAN TGX 18.510 4x2 BLS'),
    year: 2023,
    mileage: 78000,
    fuelType: 'Diesel',
    location: { city: 'Warsaw', country: 'Poland' },
    seller: { name: 'EuroBuild Sp.' },
    isFeatured: false,
    viewedAt: 'Yesterday',
  },
];

export default function RecentlyViewedPage() {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recently Viewed</h1>
            <p className="text-muted-foreground text-sm">
              {dummyRecentlyViewed.length} vehicles you&apos;ve looked at recently
            </p>
          </div>
        </div>

        {dummyRecentlyViewed.length === 0 ? (
          <EmptyState
            icon={Eye}
            title="No recently viewed listings"
            description="Start browsing to see your recently viewed vehicles here."
            action={{
              label: 'Browse Listings',
              onClick: () => router.push('/search'),
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Group by time */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dummyRecentlyViewed.filter(l => !l.viewedAt.includes('Yesterday')).map((listing) => (
                  <div key={listing.id} className="relative">
                    <ListingCard listing={listing} />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {listing.viewedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Yesterday</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dummyRecentlyViewed.filter(l => l.viewedAt.includes('Yesterday')).map((listing) => (
                  <div key={listing.id} className="relative">
                    <ListingCard listing={listing} />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {listing.viewedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
