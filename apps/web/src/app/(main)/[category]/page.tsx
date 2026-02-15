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
// Country code → name for display
// ---------------------------------------------------------------------------
const COUNTRY_NAMES: Record<string, string> = {
  NL: 'Netherlands', DE: 'Germany', BE: 'Belgium', FR: 'France',
  PL: 'Poland', ES: 'Spain', IT: 'Italy', GB: 'United Kingdom',
  CZ: 'Czech Republic', AT: 'Austria', SE: 'Sweden', DK: 'Denmark',
};

// ---------------------------------------------------------------------------
// Fuel type labels
// ---------------------------------------------------------------------------
const FUEL_LABELS: Record<string, string> = {
  DIESEL: 'Diesel', PETROL: 'Petrol', ELECTRIC: 'Electric',
  HYBRID: 'Hybrid', LPG: 'LPG', CNG: 'CNG', HYDROGEN: 'Hydrogen',
};

// ---------------------------------------------------------------------------
// Fallback category metadata (used until API responds)
// ---------------------------------------------------------------------------
const categoryMeta: Record<string, { name: string; description: string }> = {
  trucks: { name: 'Trucks', description: 'Find the best deals on trucks from verified dealers across Europe.' },
  trailers: { name: 'Trailers', description: 'Browse thousands of trailers from Europe\'s top dealers.' },
  construction: { name: 'Construction Equipment', description: 'Excavators, loaders, cranes and all types of construction equipment.' },
  vans: { name: 'Vans', description: 'Find cargo vans, delivery vans, and commercial vans from top brands.' },
  cars: { name: 'Cars', description: 'Browse commercial cars and company vehicles from verified European dealers.' },
  containers: { name: 'Containers', description: 'Shipping containers, storage containers, and specialized containers.' },
  parts: { name: 'Parts & Accessories', description: 'Truck parts, trailer parts, and commercial vehicle accessories.' },
};

const defaultMeta = { name: 'Vehicles', description: 'Browse our wide selection of commercial vehicles and equipment.' };

// ---------------------------------------------------------------------------
// Map API listing to ListingCardData
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
    fuelType: listing.fuelType ? FUEL_LABELS[listing.fuelType] || listing.fuelType : undefined,
    location: {
      city: listing.city || '',
      country: COUNTRY_NAMES[listing.countryCode] || listing.countryCode || '',
    },
    seller: {
      name: listing.sellerName || listing.seller?.name || listing.sellerCompany || 'Dealer',
    },
    isFeatured: listing.isFeatured,
  };
}

// ---------------------------------------------------------------------------
// Helper: extract name from JSON or string
// ---------------------------------------------------------------------------
function getName(name: any): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') return name.en || name.de || Object.values(name)[0] || '';
  return '';
}

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------
const sortOptions = [
  { value: 'newest', label: 'Newest First', api: 'date_desc' },
  { value: 'price-asc', label: 'Price: Low to High', api: 'price_asc' },
  { value: 'price-desc', label: 'Price: High to Low', api: 'price_desc' },
  { value: 'year-desc', label: 'Year: Newest', api: 'year_desc' },
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = params.category as string;
  const meta = categoryMeta[categorySlug] || defaultMeta;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Category details from API
  const [categoryName, setCategoryName] = useState(meta.name);
  const [categoryDescription, setCategoryDescription] = useState(meta.description);
  const [subcategories, setSubcategories] = useState<{ name: string; slug: string }[]>([]);
  const [brands, setBrands] = useState<{ name: string; slug: string }[]>([]);
  const [listingCount, setListingCount] = useState(0);

  // Read from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'newest';

  // ---------------------------------------------------------------------------
  // Fetch category details from API
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await api.get<any>(`/categories/${categorySlug}`);
        if (res?.success && res.data) {
          setCategoryName(getName(res.data.name));
          setCategoryDescription(getName(res.data.description) || meta.description);
          setListingCount(res.data.listingCount || 0);
          if (res.data.children) {
            setSubcategories(
              res.data.children.map((c: any) => ({ name: getName(c.name), slug: c.slug }))
            );
          }
          if (res.data.brands) {
            setBrands(
              res.data.brands.map((b: any) => ({ name: b.name, slug: b.slug }))
            );
          }
        }
      } catch {
        // Use fallback meta
      }
    }
    fetchCategory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  // ---------------------------------------------------------------------------
  // Fetch listings from search API
  // ---------------------------------------------------------------------------
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiSort = sortOptions.find((s) => s.value === currentSort)?.api || 'date_desc';
      const params = new URLSearchParams({
        category: categorySlug,
        sort: apiSort,
        page: String(currentPage),
        limit: '24',
      });

      const res = await api.get<any>(`/search?${params.toString()}`);

      if (res?.success && res.data?.listings) {
        setListings(res.data.listings.map(mapApiListing));
        setTotalResults(res.pagination?.total || 0);
        setTotalPages(res.pagination?.totalPages || 1);
      } else {
        setListings([]);
        setTotalResults(0);
        setTotalPages(1);
      }
    } catch {
      setListings([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, currentPage, currentSort]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ---------------------------------------------------------------------------
  // URL helpers
  // ---------------------------------------------------------------------------
  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', String(newPage));
    router.push(`/${categorySlug}?${p.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('sort', newSort);
    p.delete('page');
    router.push(`/${categorySlug}?${p.toString()}`, { scroll: false });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-background min-h-screen">
      {/* Category Header with Background Image Overlay */}
      <section className="relative text-white py-16 md:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${CATEGORY_HERO_IMAGES[categorySlug as keyof typeof CATEGORY_HERO_IMAGES] || CATEGORY_HERO_IMAGES.trucks})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/55 to-primary-950/45" />

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryName}</h1>
          <p className="text-white/85 max-w-2xl text-lg">{categoryDescription}</p>
          <p className="text-sm text-accent font-semibold mt-4 bg-white/10 inline-block px-3 py-1 rounded-full">
            {(listingCount || totalResults).toLocaleString()} listings available
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategory Chips */}
        {subcategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">Browse by Type</h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/search?category=${sub.slug}`}
                  className="px-4 py-2 rounded-full bg-white border border-border text-sm font-medium text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Brands */}
        {brands.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">Top Brands</h2>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
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
            {isLoading
              ? 'Loading...'
              : `Showing ${listings.length} of ${totalResults.toLocaleString()} results`}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={currentSort}
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
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No listings found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              There are currently no active listings in this category.
            </p>
            <Button variant="accent" asChild>
              <Link href="/search">Browse All Listings</Link>
            </Button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
