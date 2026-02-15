'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { ListingCardSkeleton } from '@/components/listings/listing-card-skeleton';
import { Pagination } from '@/components/common/pagination';
import { cn } from '@/lib/utils';
import { getImagesForListing, CATEGORY_HERO_IMAGES } from '@/lib/images';
import { api } from '@/lib/api';

// ---------------------------------------------------------------------------
// Static category metadata (used for hero section, subcategories, top brands)
// ---------------------------------------------------------------------------
const categoryData: Record<string, {
  name: string;
  description: string;
  subcategories: { name: string; slug: string }[];
  topBrands: { name: string; slug: string }[];
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
    topBrands: [
      { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
      { name: 'Volvo', slug: 'volvo' },
      { name: 'Scania', slug: 'scania' },
      { name: 'MAN', slug: 'man' },
      { name: 'DAF', slug: 'daf' },
      { name: 'Iveco', slug: 'iveco' },
      { name: 'Renault', slug: 'renault' },
    ],
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
    topBrands: [
      { name: 'Schmitz Cargobull', slug: 'schmitz-cargobull' },
      { name: 'Krone', slug: 'krone' },
      { name: 'Kogel', slug: 'kogel' },
      { name: 'Lamberet', slug: 'lamberet' },
      { name: 'Wielton', slug: 'wielton' },
    ],
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
    topBrands: [
      { name: 'Caterpillar', slug: 'caterpillar' },
      { name: 'Komatsu', slug: 'komatsu' },
      { name: 'Liebherr', slug: 'liebherr' },
      { name: 'Volvo CE', slug: 'volvo-ce' },
      { name: 'CASE', slug: 'case' },
      { name: 'JCB', slug: 'jcb' },
    ],
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
    topBrands: [
      { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
      { name: 'Ford', slug: 'ford' },
      { name: 'Volkswagen', slug: 'volkswagen' },
      { name: 'Iveco', slug: 'iveco' },
      { name: 'Renault', slug: 'renault' },
      { name: 'Peugeot', slug: 'peugeot' },
    ],
    listingCount: 12400,
  },
  cars: {
    name: 'Cars',
    description: 'Browse commercial cars and company vehicles from verified European dealers. Sedans, SUVs, and fleet vehicles.',
    subcategories: [
      { name: 'Sedans', slug: 'sedans' },
      { name: 'SUVs', slug: 'suvs' },
      { name: 'Estate Cars', slug: 'estate' },
      { name: 'Electric Cars', slug: 'electric' },
      { name: 'Company Cars', slug: 'company' },
    ],
    topBrands: [
      { name: 'BMW', slug: 'bmw' },
      { name: 'Audi', slug: 'audi' },
      { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
      { name: 'Volkswagen', slug: 'volkswagen' },
      { name: 'Toyota', slug: 'toyota' },
      { name: 'Volvo', slug: 'volvo' },
    ],
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
    topBrands: [
      { name: 'Maersk', slug: 'maersk' },
      { name: 'CIMC', slug: 'cimc' },
      { name: 'Singamas', slug: 'singamas' },
    ],
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
    topBrands: [
      { name: 'Bosch', slug: 'bosch' },
      { name: 'Wabco', slug: 'wabco' },
      { name: 'BPW', slug: 'bpw' },
      { name: 'SAF-Holland', slug: 'saf-holland' },
      { name: 'Continental', slug: 'continental' },
    ],
    listingCount: 15600,
  },
};

const defaultCategory = {
  name: 'Vehicles',
  description: 'Browse our wide selection of commercial vehicles and equipment.',
  subcategories: [] as { name: string; slug: string }[],
  topBrands: [] as { name: string; slug: string }[],
  listingCount: 5000,
};

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'year-asc', label: 'Year: Oldest' },
];

function mapSortParam(sort: string): string {
  switch (sort) {
    case 'newest': return 'date_desc';
    case 'oldest': return 'date_asc';
    case 'price-asc': return 'price_asc';
    case 'price-desc': return 'price_desc';
    case 'year-desc': return 'year_desc';
    case 'year-asc': return 'year_asc';
    default: return 'relevance';
  }
}

// ---------------------------------------------------------------------------
// Fallback dummy listing data per category
// ---------------------------------------------------------------------------
const categoryListingData: Record<string, {
  titles: string[];
  prices: number[];
  fuelTypes: string[];
  sellers: string[];
  cities: string[];
  countries: string[];
  mileageBase: number;
}> = {
  trucks: {
    titles: ['Mercedes-Benz Actros 2545 LS 6x2', 'Volvo FH 500 4x2 Globetrotter', 'Scania R 450 Highline', 'MAN TGX 18.510 4x2 BLS'],
    prices: [89500, 125000, 78900, 115000],
    fuelTypes: ['Diesel', 'Diesel', 'Diesel', 'Diesel'],
    sellers: ['TransEuropa BV', 'Nordic Trucks', 'FleetPro NV', 'BavariaTruck AG'],
    cities: ['Rotterdam', 'Hamburg', 'Antwerp', 'Munich'],
    countries: ['Netherlands', 'Germany', 'Belgium', 'Germany'],
    mileageBase: 120000,
  },
  trailers: {
    titles: ['Schmitz Cargobull Curtainsider SCS 24/L', 'Krone Mega Liner SDC 27 eLTU', 'Kogel Flatbed SNCO 24 P90', 'Lamberet Reefer SR2 Thermo King'],
    prices: [32000, 45000, 28500, 52000],
    fuelTypes: ['N/A', 'N/A', 'N/A', 'N/A'],
    sellers: ['TrailerPoint GmbH', 'Krone Center', 'FleetTrailers BV', 'CoolTransport NV'],
    cities: ['Bremen', 'Werlte', 'Rotterdam', 'Brussels'],
    countries: ['Germany', 'Germany', 'Netherlands', 'Belgium'],
    mileageBase: 0,
  },
  construction: {
    titles: ['CAT 320 GC Excavator', 'Komatsu PC210 LC-11 Excavator', 'Liebherr L 566 XPower Wheel Loader', 'Volvo EC220E Excavator'],
    prices: [185000, 142000, 220000, 168000],
    fuelTypes: ['Diesel', 'Diesel', 'Diesel', 'Diesel'],
    sellers: ['Zeppelin AG', 'Kuhn Baumaschinen', 'Liebherr Direct', 'Swecon AB'],
    cities: ['Munich', 'Cologne', 'Biberach', 'Stockholm'],
    countries: ['Germany', 'Germany', 'Germany', 'Sweden'],
    mileageBase: 5000,
  },
  vans: {
    titles: ['Mercedes-Benz Sprinter 316 CDI L3H2', 'Ford Transit 350 L3H2 EcoBlue', 'VW Crafter 35 TDI L4H3', 'Iveco Daily 35S18 Hi-Matic'],
    prices: [38500, 32000, 35800, 29500],
    fuelTypes: ['Diesel', 'Diesel', 'Diesel', 'Diesel'],
    sellers: ['VanCenter BV', 'Ford Trucks Direct', 'Volkswagen Commercial', 'Iveco Dealer NL'],
    cities: ['Amsterdam', 'London', 'Hannover', 'Milan'],
    countries: ['Netherlands', 'United Kingdom', 'Germany', 'Italy'],
    mileageBase: 60000,
  },
  cars: {
    titles: ['BMW 5 Series 530d xDrive Touring', 'Audi A6 Avant 45 TDI quattro', 'Mercedes-Benz E-Class E300 AMG Line', 'VW Passat Variant 2.0 TDI Business'],
    prices: [52000, 48500, 55000, 34500],
    fuelTypes: ['Diesel', 'Diesel', 'Petrol', 'Diesel'],
    sellers: ['BMW Premium Select', 'Audi Zentrum', 'Mercedes-Benz Certified', 'Das WeltAuto'],
    cities: ['Munich', 'Ingolstadt', 'Stuttgart', 'Wolfsburg'],
    countries: ['Germany', 'Germany', 'Germany', 'Germany'],
    mileageBase: 45000,
  },
  containers: {
    titles: ['20ft Standard Shipping Container', '40ft High Cube Container HC', 'Reefer Container 40ft Carrier Unit', '20ft Storage Container Side Opening'],
    prices: [2800, 4500, 12000, 3200],
    fuelTypes: ['N/A', 'N/A', 'N/A', 'N/A'],
    sellers: ['ContainerPort BV', 'EuroBox GmbH', 'SeaCargo Containers', 'FlexiStore Ltd'],
    cities: ['Rotterdam', 'Hamburg', 'Antwerp', 'Felixstowe'],
    countries: ['Netherlands', 'Germany', 'Belgium', 'United Kingdom'],
    mileageBase: 0,
  },
  parts: {
    titles: ['Truck Engine Assembly OM471 Mercedes', 'Brake Caliper Set Knorr-Bremse SB7', 'Tyre Set 315/80 R22.5 Continental', 'Air Filter Kit Mann+Hummel C30810'],
    prices: [8500, 420, 1200, 85],
    fuelTypes: ['N/A', 'N/A', 'N/A', 'N/A'],
    sellers: ['EuroParts Direct', 'BrakeTech GmbH', 'TyrePro BV', 'FilterKing NL'],
    cities: ['Dusseldorf', 'Stuttgart', 'Rotterdam', 'Amsterdam'],
    countries: ['Germany', 'Germany', 'Netherlands', 'Netherlands'],
    mileageBase: 0,
  },
};

function getDummyListings(categorySlug: string): ListingCardData[] {
  const data = categoryListingData[categorySlug] || categoryListingData.trucks;
  return Array.from({ length: 12 }, (_, i) => ({
    id: `cat-${i}`,
    slug: `category-listing-${i}`,
    title: data.titles[i % data.titles.length],
    price: data.prices[i % data.prices.length],
    currency: 'EUR',
    condition: (i % 4 === 0 ? 'NEW' : 'USED') as 'NEW' | 'USED',
    images: getImagesForListing(data.titles[i % data.titles.length]),
    year: 2020 + (i % 4),
    mileage: data.mileageBase === 0 ? 0 : data.mileageBase + i * 15000,
    fuelType: data.fuelTypes[i % data.fuelTypes.length],
    location: {
      city: data.cities[i % data.cities.length],
      country: data.countries[i % data.countries.length],
    },
    seller: { name: data.sellers[i % data.sellers.length] },
    isFeatured: i < 2,
  }));
}

// ---------------------------------------------------------------------------
// Map API listing to frontend ListingCardData
// ---------------------------------------------------------------------------
function mapApiListing(listing: any): ListingCardData {
  let images: string[] = [];
  if (listing.images && Array.isArray(listing.images)) {
    if (typeof listing.images[0] === 'string') {
      images = listing.images;
    } else {
      images = listing.images
        .map((img: any) => img.mediumUrl || img.thumbnailUrl || img.originalUrl)
        .filter(Boolean);
    }
  }
  if (images.length === 0) {
    images = getImagesForListing(listing.title || '');
  }

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    price: listing.price ? Number(listing.price) : 0,
    currency: listing.priceCurrency || 'EUR',
    condition: listing.condition || 'USED',
    images,
    year: listing.year,
    mileage: listing.mileageKm,
    fuelType: listing.fuelType,
    location: {
      city: listing.city || listing.location?.city || '',
      country: listing.countryCode || listing.location?.country || '',
    },
    seller: {
      name: listing.sellerName || listing.seller?.name || listing.sellerCompany || 'Dealer',
    },
    isFeatured: listing.isFeatured,
  };
}

// ---------------------------------------------------------------------------
// CategoryPage Component
// ---------------------------------------------------------------------------
export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = params.category as string;
  const category = categoryData[categorySlug] || defaultCategory;

  // URL-driven state
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Data state — initialised with dummy data so listings always show
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [listings, setListings] = useState<ListingCardData[]>(() => getDummyListings(categorySlug));
  const [totalResults, setTotalResults] = useState(category.listingCount);
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch listings from API with fallback to dummy data
  // ---------------------------------------------------------------------------
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiParams = new URLSearchParams();
      apiParams.set('category', categorySlug);
      apiParams.set('sort', mapSortParam(sort));
      apiParams.set('page', String(page));
      apiParams.set('limit', '12');

      const response = await api.get<any>(`/search?${apiParams.toString()}`);

      if (response?.success && response?.data?.listings) {
        const apiListings = response.data.listings.map(mapApiListing);
        // Only use API data if it returned results, otherwise keep dummy
        if (apiListings.length > 0) {
          setListings(apiListings);
          setTotalResults(response.pagination?.total || apiListings.length);
          setTotalPages(response.pagination?.totalPages || 1);
          setCurrentPage(response.pagination?.page || page);
        } else {
          // API returned empty — use dummy data
          const dummy = getDummyListings(categorySlug);
          setListings(dummy);
          setTotalResults(category.listingCount);
          setTotalPages(10);
          setCurrentPage(page);
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      // API unavailable — use dummy data
      const dummy = getDummyListings(categorySlug);

      // Apply sort to dummy data
      switch (sort) {
        case 'price-asc':
          dummy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
          break;
        case 'price-desc':
          dummy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
          break;
        case 'year-desc':
          dummy.sort((a, b) => b.year - a.year);
          break;
        case 'year-asc':
          dummy.sort((a, b) => a.year - b.year);
          break;
      }

      setListings(dummy);
      setTotalResults(category.listingCount);
      setTotalPages(10);
      setCurrentPage(page);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, sort, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ---------------------------------------------------------------------------
  // URL handlers for sort & pagination
  // ---------------------------------------------------------------------------
  const handleSortChange = (newSort: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('sort', newSort);
    p.delete('page');
    router.push(`/${categorySlug}?${p.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', String(newPage));
    router.push(`/${categorySlug}?${p.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/55 to-primary-950/45" />

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
          <p className="text-white/85 max-w-2xl text-lg">{category.description}</p>
          <p className="text-sm text-accent font-semibold mt-4 bg-white/10 inline-block px-3 py-1 rounded-full">
            {totalResults.toLocaleString()} listings available
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

        {/* Top Brands — links now use slugs */}
        {category.topBrands.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">Top Brands</h2>
            <div className="flex flex-wrap gap-2">
              {category.topBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/search?category=${categorySlug}&brand=${brand.slug}`}
                  className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {listings.length} of {totalResults.toLocaleString()} results
          </p>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
        {isLoading ? (
          <div
            className={cn(
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
            )}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <ListingCardSkeleton key={i} view={view} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
            )}
          >
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} view={view} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
