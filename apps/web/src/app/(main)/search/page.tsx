'use client';

import { useState, useEffect, useCallback } from 'react';
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

const categoryOptions = [
  'Trucks', 'Trailers', 'Construction', 'Vans', 'Cars', 'Containers', 'Parts', 'Agricultural',
];

const brandOptions = [
  'Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'DAF', 'Iveco', 'Renault', 'Caterpillar',
  'Komatsu', 'Liebherr', 'CASE', 'John Deere',
];

const conditionOptions = ['New', 'Used'];
const fuelTypeOptions = ['Diesel', 'Electric', 'Hybrid', 'LNG', 'CNG', 'Petrol'];
const transmissionOptions = ['Manual', 'Automatic', 'Semi-automatic'];
const countryOptions = [
  'Netherlands', 'Germany', 'Belgium', 'France', 'Poland', 'Spain', 'Italy', 'United Kingdom',
  'Czech Republic', 'Austria', 'Sweden', 'Denmark',
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'year-asc', label: 'Year: Oldest' },
];

// Dummy data
const dummyListings: ListingCardData[] = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  slug: `listing-${i + 1}`,
  title: [
    'Mercedes-Benz Actros 2545 LS 6x2',
    'Volvo FH 500 4x2 Globetrotter XL',
    'Scania R 450 A4x2NA Highline',
    'MAN TGX 18.510 4x2 BLS',
    'DAF XF 480 FT Space Cab',
    'Iveco S-Way AS440S48T/P',
    'Renault T480 High Sleeper Cab',
    'Caterpillar 320 GC Excavator',
  ][i % 8],
  price: [89500, 125000, 78900, 115000, 92000, 98000, 76500, 165000][i % 8],
  currency: 'EUR',
  condition: (i % 5 === 0 ? 'NEW' : 'USED') as 'NEW' | 'USED',
  images: getImagesForListing([
    'Mercedes-Benz Actros 2545 LS 6x2',
    'Volvo FH 500 4x2 Globetrotter XL',
    'Scania R 450 A4x2NA Highline',
    'MAN TGX 18.510 4x2 BLS',
    'DAF XF 480 FT Space Cab',
    'Iveco S-Way AS440S48T/P',
    'Renault T480 High Sleeper Cab',
    'Caterpillar 320 GC Excavator',
  ][i % 8]),
  year: 2019 + (i % 5),
  mileage: i % 5 === 0 ? 0 : 50000 + i * 25000,
  fuelType: 'Diesel',
  location: {
    city: ['Rotterdam', 'Hamburg', 'Antwerp', 'Munich', 'Eindhoven', 'Warsaw', 'Paris', 'Madrid'][i % 8],
    country: ['Netherlands', 'Germany', 'Belgium', 'Germany', 'Netherlands', 'Poland', 'France', 'Spain'][i % 8],
  },
  seller: {
    name: ['TransEuropa BV', 'Nordic Trucks GmbH', 'FleetPro NV', 'BavariaTruck AG', 'DutchFleet BV', 'EuroBuild Sp.', 'FleetFrance SA', 'IberiaTruck SL'][i % 8],
  },
  isFeatured: i < 3,
}));

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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandSearch, setBrandSearch] = useState('');

  // Read filters from URL
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

  const updateURL = useCallback(
    (key: string, value: string | string[], replace = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else if (replace) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      } else {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
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

  const filteredBrands = brandOptions.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const totalPages = 8;
  const totalResults = 186;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/search?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterContent = (
    <div className="space-y-0">
      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {categoryOptions.map((cat) => (
            <Checkbox
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat.toLowerCase())}
              onCheckedChange={() => toggleArrayFilter('category', cat.toLowerCase(), selectedCategories)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <Input
          placeholder="Search brands..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="mb-3 h-8 text-xs"
        />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredBrands.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleArrayFilter('brand', brand, selectedBrands)}
            />
          ))}
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

      {/* Condition */}
      <FilterSection title="Condition">
        <div className="space-y-2">
          {conditionOptions.map((cond) => (
            <Checkbox
              key={cond}
              label={cond}
              checked={selectedConditions.includes(cond.toLowerCase())}
              onCheckedChange={() => toggleArrayFilter('condition', cond.toLowerCase(), selectedConditions)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type" defaultOpen={false}>
        <div className="space-y-2">
          {fuelTypeOptions.map((fuel) => (
            <Checkbox
              key={fuel}
              label={fuel}
              checked={selectedFuelTypes.includes(fuel.toLowerCase())}
              onCheckedChange={() => toggleArrayFilter('fuelType', fuel.toLowerCase(), selectedFuelTypes)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission" defaultOpen={false}>
        <div className="space-y-2">
          {transmissionOptions.map((trans) => (
            <Checkbox
              key={trans}
              label={trans}
              checked={selectedTransmissions.includes(trans.toLowerCase())}
              onCheckedChange={() =>
                toggleArrayFilter('transmission', trans.toLowerCase(), selectedTransmissions)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Country */}
      <FilterSection title="Country" defaultOpen={false}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {countryOptions.map((country) => (
            <Checkbox
              key={country}
              label={country}
              checked={selectedCountries.includes(country.toLowerCase())}
              onCheckedChange={() =>
                toggleArrayFilter('country', country.toLowerCase(), selectedCountries)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Clear All */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
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
            ) : (
              <>
                <div
                  className={cn(
                    view === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
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
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
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
