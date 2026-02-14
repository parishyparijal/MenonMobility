'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { Pagination } from '@/components/common/pagination';
import { cn } from '@/lib/utils';
import { getImagesForListing, CATEGORY_HERO_IMAGES } from '@/lib/images';

const categoryData: Record<string, {
  name: string;
  description: string;
  subcategories: { name: string; slug: string }[];
  topBrands: string[];
  listingCount: number;
}> = {
  trucks: {
    name: 'Trucks',
    description: 'Find the best deals on trucks from verified dealers across Europe. From box trucks to tractor units, we have the largest selection.',
    subcategories: [
      { name: 'Tractor Units', slug: 'tractor-units' },
      { name: 'Box Trucks', slug: 'box-trucks' },
      { name: 'Flatbed Trucks', slug: 'flatbed' },
      { name: 'Refrigerated Trucks', slug: 'refrigerated' },
      { name: 'Tanker Trucks', slug: 'tanker' },
      { name: 'Tipper Trucks', slug: 'tipper' },
      { name: 'Curtainside Trucks', slug: 'curtainside' },
      { name: 'Recovery Trucks', slug: 'recovery' },
    ],
    topBrands: ['Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'DAF', 'Iveco', 'Renault'],
    listingCount: 45230,
  },
  trailers: {
    name: 'Trailers',
    description: 'Browse thousands of trailers including semi-trailers, flatbeds, refrigerated trailers and more from Europe\'s top dealers.',
    subcategories: [
      { name: 'Semi Trailers', slug: 'semi' },
      { name: 'Flatbed Trailers', slug: 'flatbed' },
      { name: 'Refrigerated Trailers', slug: 'refrigerated' },
      { name: 'Curtain Side', slug: 'curtain-side' },
      { name: 'Low Loaders', slug: 'low-loaders' },
      { name: 'Box Trailers', slug: 'box' },
    ],
    topBrands: ['Schmitz Cargobull', 'Krone', 'Kögel', 'Lamberet', 'Wielton'],
    listingCount: 28150,
  },
  construction: {
    name: 'Construction Equipment',
    description: 'Excavators, loaders, cranes and all types of construction equipment from trusted dealers.',
    subcategories: [
      { name: 'Excavators', slug: 'excavators' },
      { name: 'Wheel Loaders', slug: 'wheel-loaders' },
      { name: 'Cranes', slug: 'cranes' },
      { name: 'Bulldozers', slug: 'bulldozers' },
      { name: 'Dump Trucks', slug: 'dump-trucks' },
      { name: 'Concrete Equipment', slug: 'concrete' },
    ],
    topBrands: ['Caterpillar', 'Komatsu', 'Liebherr', 'Volvo CE', 'CASE', 'JCB'],
    listingCount: 18700,
  },
  vans: {
    name: 'Vans',
    description: 'Find cargo vans, delivery vans, and commercial vans from top brands. Sprinters, Transits, Crafters and more.',
    subcategories: [
      { name: 'Cargo Vans', slug: 'cargo' },
      { name: 'Passenger Vans', slug: 'passenger' },
      { name: 'Box Vans', slug: 'box' },
      { name: 'Refrigerated Vans', slug: 'refrigerated' },
    ],
    topBrands: ['Mercedes-Benz', 'Ford', 'Volkswagen', 'Iveco', 'Renault', 'Peugeot'],
    listingCount: 12400,
  },
  cars: {
    name: 'Cars',
    description: 'Browse commercial cars and company vehicles from verified European dealers.',
    subcategories: [],
    topBrands: [],
    listingCount: 8200,
  },
  containers: {
    name: 'Containers',
    description: 'Shipping containers, storage containers, and specialized containers from trusted sellers across Europe.',
    subcategories: [
      { name: 'Shipping Containers', slug: 'shipping' },
      { name: 'Storage Containers', slug: 'storage' },
      { name: 'Refrigerated Containers', slug: 'refrigerated' },
      { name: 'Tank Containers', slug: 'tank' },
    ],
    topBrands: ['Maersk', 'CIMC', 'Singamas'],
    listingCount: 4500,
  },
  parts: {
    name: 'Parts & Accessories',
    description: 'Truck parts, trailer parts, and commercial vehicle accessories from European suppliers.',
    subcategories: [
      { name: 'Engine Parts', slug: 'engine' },
      { name: 'Brakes & Suspension', slug: 'brakes' },
      { name: 'Electrical', slug: 'electrical' },
      { name: 'Body Parts', slug: 'body' },
      { name: 'Tyres & Wheels', slug: 'tyres' },
    ],
    topBrands: ['Bosch', 'Wabco', 'BPW', 'SAF-Holland', 'Continental'],
    listingCount: 15600,
  },
};

const defaultCategory = {
  name: 'Vehicles',
  description: 'Browse our wide selection of commercial vehicles and equipment.',
  subcategories: [],
  topBrands: [],
  listingCount: 5000,
};

const dummyListings: ListingCardData[] = Array.from({ length: 12 }, (_, i) => ({
  id: `cat-${i}`,
  slug: `category-listing-${i}`,
  title: [
    'Mercedes-Benz Actros 2545 LS 6x2',
    'Volvo FH 500 4x2 Globetrotter',
    'Scania R 450 Highline',
    'MAN TGX 18.510 4x2 BLS',
  ][i % 4],
  price: [89500, 125000, 78900, 115000][i % 4],
  currency: 'EUR',
  condition: (i % 4 === 0 ? 'NEW' : 'USED') as 'NEW' | 'USED',
  images: getImagesForListing([
    'Mercedes-Benz Actros 2545 LS 6x2',
    'Volvo FH 500 4x2 Globetrotter',
    'Scania R 450 Highline',
    'MAN TGX 18.510 4x2 BLS',
  ][i % 4]),
  year: 2020 + (i % 4),
  mileage: i % 4 === 0 ? 0 : 100000 + i * 30000,
  fuelType: 'Diesel',
  location: {
    city: ['Rotterdam', 'Hamburg', 'Antwerp', 'Munich'][i % 4],
    country: ['Netherlands', 'Germany', 'Belgium', 'Germany'][i % 4],
  },
  seller: { name: ['TransEuropa BV', 'Nordic Trucks', 'FleetPro NV', 'BavariaTruck AG'][i % 4] },
  isFeatured: i < 2,
}));

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const category = categoryData[categorySlug] || defaultCategory;
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="bg-background min-h-screen">
      {/* Category Header with Background Image Overlay */}
      <section className="relative text-white py-16 md:py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${CATEGORY_HERO_IMAGES[categorySlug as keyof typeof CATEGORY_HERO_IMAGES] || CATEGORY_HERO_IMAGES.trucks})`,
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary-950/70" />
        {/* Bottom fade for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
          <p className="text-white/85 max-w-2xl text-lg">{category.description}</p>
          <p className="text-sm text-accent font-semibold mt-4 bg-white/10 backdrop-blur-sm inline-block px-3 py-1 rounded-full">
            {category.listingCount.toLocaleString()} listings available
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategory Chips */}
        {category.subcategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">Browse by Type</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/search?category=${categorySlug}&subcategory=${sub.slug}`}
                  className="px-4 py-2 rounded-full bg-white border border-border text-sm font-medium text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Brands */}
        {category.topBrands.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">Top Brands</h2>
            <div className="flex flex-wrap gap-2">
              {category.topBrands.map((brand) => (
                <Link
                  key={brand}
                  href={`/search?category=${categorySlug}&brand=${encodeURIComponent(brand)}`}
                  className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {dummyListings.length} of {category.listingCount.toLocaleString()} results
          </p>
          <div className="flex items-center gap-2">
            <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={cn(
                  'p-2 transition-colors',
                  view === 'grid' ? 'bg-primary text-white' : 'bg-white text-foreground hover:bg-muted'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'p-2 transition-colors',
                  view === 'list' ? 'bg-primary text-white' : 'bg-white text-foreground hover:bg-muted'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button variant="accent" asChild>
              <Link href={`/search?category=${categorySlug}`}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                All Filters
              </Link>
            </Button>
          </div>
        </div>

        {/* Listing Grid */}
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          )}
        >
          {dummyListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} view={view} />
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
