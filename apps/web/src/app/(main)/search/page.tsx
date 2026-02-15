'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { ListingCardSkeleton } from '@/components/listings/listing-card-skeleton';
import { Pagination } from '@/components/common/pagination';
import { cn } from '@/lib/utils';
import { getImagesForListing } from '@/lib/images';
import { api } from '@/lib/api';

// ---------------------------------------------------------------------------
// Country code → display name mapping
// ---------------------------------------------------------------------------
const COUNTRY_NAMES: Record<string, string> = {
  NL: 'Netherlands', DE: 'Germany', BE: 'Belgium', FR: 'France',
  PL: 'Poland', ES: 'Spain', IT: 'Italy', GB: 'United Kingdom',
  CZ: 'Czech Republic', AT: 'Austria', SE: 'Sweden', DK: 'Denmark',
  PT: 'Portugal', IE: 'Ireland', FI: 'Finland', NO: 'Norway',
  CH: 'Switzerland', HU: 'Hungary', RO: 'Romania', BG: 'Bulgaria',
  SK: 'Slovakia', HR: 'Croatia', LT: 'Lithuania', LV: 'Latvia',
  EE: 'Estonia', SI: 'Slovenia', LU: 'Luxembourg',
};

// ---------------------------------------------------------------------------
// Enum display labels
// ---------------------------------------------------------------------------
const CONDITION_LABELS: Record<string, string> = {
  NEW: 'New', USED: 'Used', REFURBISHED: 'Refurbished',
};
const FUEL_LABELS: Record<string, string> = {
  DIESEL: 'Diesel', PETROL: 'Petrol', ELECTRIC: 'Electric',
  HYBRID: 'Hybrid', LPG: 'LPG', CNG: 'CNG', HYDROGEN: 'Hydrogen',
};
const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: 'Manual', AUTOMATIC: 'Automatic', SEMI_AUTOMATIC: 'Semi-automatic',
};

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'year-asc', label: 'Year: Oldest' },
];

// ---------------------------------------------------------------------------
// Map frontend sort param to backend expected format
// ---------------------------------------------------------------------------
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
// Map API listing response to frontend ListingCardData
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
// Aggregation types from API
// ---------------------------------------------------------------------------
interface Aggregations {
  categories: { id: string; name: any; slug: string; count: number }[];
  brands: { id: string; name: string; slug: string; count: number }[];
  conditions: { value: string; count: number }[];
  fuelTypes: { value: string; count: number }[];
  countries: { value: string; count: number }[];
}

// ---------------------------------------------------------------------------
// FilterSection component
// ---------------------------------------------------------------------------
interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: extract category display name (may be JSON {en: "..."} or string)
// ---------------------------------------------------------------------------
function getCategoryName(name: any): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') return name.en || name.de || Object.values(name)[0] || '';
  return '';
}

// ---------------------------------------------------------------------------
// SearchPage Component
// ---------------------------------------------------------------------------
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [brandSearch, setBrandSearch] = useState('');

  // Data state
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic filter options from API aggregations
  const [agg, setAgg] = useState<Aggregations>({
    categories: [],
    brands: [],
    conditions: [],
    fuelTypes: [],
    countries: [],
  });

  // Debounce timer for search input
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Read filters from URL — values are slugs/enum values
  const query = searchParams.get('q') || '';
  const selectedCategories = searchParams.getAll('category');
  const selectedBrands = searchParams.getAll('brand');
  const selectedConditions = searchParams.getAll('condition');
  const selectedFuelTypes = searchParams.getAll('fuelType');
  const selectedTransmissions = searchParams.getAll('transmission');
  const selectedCountries = searchParams.getAll('country');
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';
  const yearMin = searchParams.get('yearMin') || '';
  const yearMax = searchParams.get('yearMax') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // ---------------------------------------------------------------------------
  // Fetch data from API
  // ---------------------------------------------------------------------------
  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);

    try {
      // Build API query params — values are already slugs/enums from URL
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedCategories.length > 0) params.set('category', selectedCategories[0]);
      if (selectedBrands.length > 0) params.set('brand', selectedBrands[0]);
      if (selectedConditions.length > 0) params.set('condition', selectedConditions[0]);
      if (selectedFuelTypes.length > 0) params.set('fuelType', selectedFuelTypes[0]);
      if (selectedTransmissions.length > 0) params.set('transmission', selectedTransmissions[0]);
      if (selectedCountries.length > 0) params.set('countryCode', selectedCountries[0]);
      if (priceMin) params.set('minPrice', priceMin);
      if (priceMax) params.set('maxPrice', priceMax);
      if (yearMin) params.set('minYear', yearMin);
      if (yearMax) params.set('maxYear', yearMax);
      params.set('sort', mapSortParam(sort));
      params.set('page', String(page));
      params.set('limit', '24');

      const response = await api.get<any>(`/search?${params.toString()}`);

      if (response?.success && response?.data?.listings) {
        const apiListings = response.data.listings.map(mapApiListing);
        setListings(apiListings);
        setTotalResults(response.pagination?.total || apiListings.length);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.page || page);

        // Update filter aggregations from API response
        if (response.data.aggregations) {
          setAgg(response.data.aggregations);
        }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Fetch on URL param changes
  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  // ---------------------------------------------------------------------------
  // URL state management
  // ---------------------------------------------------------------------------
  const updateURL = useCallback(
    (key: string, value: string | string[], replace = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      params.delete('page');
      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const toggleArrayFilter = useCallback(
    (key: string, value: string, currentValues: string[]) => {
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      updateURL(key, newValues);
    },
    [updateURL]
  );

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedConditions.length > 0 ||
    selectedFuelTypes.length > 0 ||
    selectedTransmissions.length > 0 ||
    selectedCountries.length > 0 ||
    priceMin ||
    priceMax ||
    yearMin ||
    yearMax;

  // Filter brands by search input
  const displayBrands = agg.brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/search?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Debounced search input handler
  const handleSearchInput = (value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateURL('q', value, true);
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // Filter sidebar content (shared between desktop & mobile)
  // ---------------------------------------------------------------------------
  const filterContent = (
    <div className="space-y-0">
      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {agg.categories.length > 0 ? (
            agg.categories.map((cat) => (
              <Checkbox
                key={cat.slug}
                label={`${getCategoryName(cat.name)} (${cat.count})`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleArrayFilter('category', cat.slug, selectedCategories)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No categories found</p>
          )}
        </div>
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        <Input
          placeholder="Search brands..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="mb-3 h-8 text-xs"
        />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {displayBrands.length > 0 ? (
            displayBrands.map((brand) => (
              <Checkbox
                key={brand.slug}
                label={`${brand.name} (${brand.count})`}
                checked={selectedBrands.includes(brand.slug)}
                onCheckedChange={() => toggleArrayFilter('brand', brand.slug, selectedBrands)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No brands found</p>
          )}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => updateURL('priceMin', e.target.value, true)}
            className="h-8 text-xs"
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => updateURL('priceMax', e.target.value, true)}
            className="h-8 text-xs"
          />
        </div>
      </FilterSection>

      {/* Year Range */}
      <FilterSection title="Year Range">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            value={yearMin}
            onChange={(e) => updateURL('yearMin', e.target.value, true)}
            className="h-8 text-xs"
          />
          <Input
            type="number"
            placeholder="To"
            value={yearMax}
            onChange={(e) => updateURL('yearMax', e.target.value, true)}
            className="h-8 text-xs"
          />
        </div>
      </FilterSection>

      {/* Condition Filter */}
      <FilterSection title="Condition">
        <div className="space-y-2">
          {agg.conditions.length > 0 ? (
            agg.conditions.map((c) => (
              <Checkbox
                key={c.value}
                label={`${CONDITION_LABELS[c.value] || c.value} (${c.count})`}
                checked={selectedConditions.includes(c.value)}
                onCheckedChange={() => toggleArrayFilter('condition', c.value, selectedConditions)}
              />
            ))
          ) : (
            ['NEW', 'USED', 'REFURBISHED'].map((c) => (
              <Checkbox
                key={c}
                label={CONDITION_LABELS[c]}
                checked={selectedConditions.includes(c)}
                onCheckedChange={() => toggleArrayFilter('condition', c, selectedConditions)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Fuel Type Filter */}
      <FilterSection title="Fuel Type" defaultOpen={false}>
        <div className="space-y-2">
          {agg.fuelTypes.length > 0 ? (
            agg.fuelTypes.filter((f) => f.value).map((f) => (
              <Checkbox
                key={f.value}
                label={`${FUEL_LABELS[f.value] || f.value} (${f.count})`}
                checked={selectedFuelTypes.includes(f.value)}
                onCheckedChange={() => toggleArrayFilter('fuelType', f.value, selectedFuelTypes)}
              />
            ))
          ) : (
            Object.entries(FUEL_LABELS).map(([value, label]) => (
              <Checkbox
                key={value}
                label={label}
                checked={selectedFuelTypes.includes(value)}
                onCheckedChange={() => toggleArrayFilter('fuelType', value, selectedFuelTypes)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Transmission Filter */}
      <FilterSection title="Transmission" defaultOpen={false}>
        <div className="space-y-2">
          {Object.entries(TRANSMISSION_LABELS).map(([value, label]) => (
            <Checkbox
              key={value}
              label={label}
              checked={selectedTransmissions.includes(value)}
              onCheckedChange={() => toggleArrayFilter('transmission', value, selectedTransmissions)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Country Filter */}
      <FilterSection title="Country" defaultOpen={false}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {agg.countries.length > 0 ? (
            agg.countries.filter((c) => c.value).map((c) => (
              <Checkbox
                key={c.value}
                label={`${COUNTRY_NAMES[c.value] || c.value} (${c.count})`}
                checked={selectedCountries.includes(c.value)}
                onCheckedChange={() => toggleArrayFilter('country', c.value, selectedCountries)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No country data</p>
          )}
        </div>
      </FilterSection>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  // ---------------------------------------------------------------------------
  // Active filter chips
  // ---------------------------------------------------------------------------
  const activeFilterChips: { label: string; onRemove: () => void }[] = [];

  selectedCategories.forEach((slug) => {
    const cat = agg.categories.find((c) => c.slug === slug);
    const label = cat ? getCategoryName(cat.name) : slug;
    activeFilterChips.push({
      label: `Category: ${label}`,
      onRemove: () => toggleArrayFilter('category', slug, selectedCategories),
    });
  });
  selectedBrands.forEach((slug) => {
    const brand = agg.brands.find((b) => b.slug === slug);
    const label = brand ? brand.name : slug;
    activeFilterChips.push({
      label: `Brand: ${label}`,
      onRemove: () => toggleArrayFilter('brand', slug, selectedBrands),
    });
  });
  selectedConditions.forEach((cond) => {
    activeFilterChips.push({
      label: `Condition: ${CONDITION_LABELS[cond] || cond}`,
      onRemove: () => toggleArrayFilter('condition', cond, selectedConditions),
    });
  });
  selectedFuelTypes.forEach((ft) => {
    activeFilterChips.push({
      label: `Fuel: ${FUEL_LABELS[ft] || ft}`,
      onRemove: () => toggleArrayFilter('fuelType', ft, selectedFuelTypes),
    });
  });
  selectedTransmissions.forEach((tr) => {
    activeFilterChips.push({
      label: `Transmission: ${TRANSMISSION_LABELS[tr] || tr}`,
      onRemove: () => toggleArrayFilter('transmission', tr, selectedTransmissions),
    });
  });
  selectedCountries.forEach((cc) => {
    activeFilterChips.push({
      label: `Country: ${COUNTRY_NAMES[cc] || cc}`,
      onRemove: () => toggleArrayFilter('country', cc, selectedCountries),
    });
  });
  if (priceMin || priceMax) {
    activeFilterChips.push({
      label: `Price: €${priceMin || '0'} - €${priceMax || '...'}`,
      onRemove: () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('priceMin');
        params.delete('priceMax');
        params.delete('page');
        router.push(`/search?${params.toString()}`, { scroll: false });
      },
    });
  }
  if (yearMin || yearMax) {
    activeFilterChips.push({
      label: `Year: ${yearMin || '...'} - ${yearMax || '...'}`,
      onRemove: () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('yearMin');
        params.delete('yearMax');
        params.delete('page');
        router.push(`/search?${params.toString()}`, { scroll: false });
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-background min-h-screen">
      {/* Search Bar */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicles..."
                defaultValue={query}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    updateURL('q', (e.target as HTMLInputElement).value, true);
                  }
                }}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:block">
                {totalResults.toLocaleString()} results
              </span>
              <select
                value={sort}
                onChange={(e) => updateURL('sort', e.target.value, true)}
                className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary hidden sm:block"
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
                    'p-2.5 transition-colors',
                    view === 'grid' ? 'bg-primary text-white' : 'bg-white text-foreground hover:bg-muted'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn(
                    'p-2.5 transition-colors',
                    view === 'list' ? 'bg-primary text-white' : 'bg-white text-foreground hover:bg-muted'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Active Filter Chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilterChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                {chip.label}
                <button onClick={chip.onRemove} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-destructive px-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-border p-4 sticky top-20">
              <h3 className="font-semibold text-foreground mb-4">Filters</h3>
              {filterContent}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div
                className={cn(
                  view === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
                <Button variant="accent" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    view === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                      : 'space-y-4'
                  )}
                >
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} view={view} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-opacity',
          mobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
        <div
          className={cn(
            'absolute inset-y-0 right-0 w-full max-w-sm bg-white transform transition-transform',
            mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Filters</h3>
            <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)] p-4">{filterContent}</div>
        </div>
      </div>

      {/* Mobile Floating Filter Button */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden bg-primary text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-accent" />
        )}
      </button>
    </div>
  );
}
