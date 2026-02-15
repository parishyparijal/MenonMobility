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
// Filter option types & helpers
// ---------------------------------------------------------------------------
interface FilterOption {
  label: string;
  value: string;
}

function findLabel(options: FilterOption[], value: string): string {
  return options.find((o) => o.value === value)?.label || value;
}

/** Normalize a URL param to slug format (lowercase, spaces→hyphens) */
function toSlug(v: string): string {
  return v.toLowerCase().replace(/\s+/g, '-');
}

// ---------------------------------------------------------------------------
// Static filter options — values match API expected formats
// ---------------------------------------------------------------------------
const categoryOptions: FilterOption[] = [
  { label: 'Trucks', value: 'trucks' },
  { label: 'Trailers', value: 'trailers' },
  { label: 'Construction', value: 'construction' },
  { label: 'Vans', value: 'vans' },
  { label: 'Cars', value: 'cars' },
  { label: 'Containers', value: 'containers' },
  { label: 'Parts', value: 'parts' },
  { label: 'Agricultural', value: 'agricultural' },
];

const brandOptions: FilterOption[] = [
  { label: 'Mercedes-Benz', value: 'mercedes-benz' },
  { label: 'Volvo', value: 'volvo' },
  { label: 'Scania', value: 'scania' },
  { label: 'MAN', value: 'man' },
  { label: 'DAF', value: 'daf' },
  { label: 'Iveco', value: 'iveco' },
  { label: 'Renault', value: 'renault' },
  { label: 'Caterpillar', value: 'caterpillar' },
  { label: 'Komatsu', value: 'komatsu' },
  { label: 'Liebherr', value: 'liebherr' },
  { label: 'CASE', value: 'case' },
  { label: 'John Deere', value: 'john-deere' },
];

const conditionOptions: FilterOption[] = [
  { label: 'New', value: 'NEW' },
  { label: 'Used', value: 'USED' },
  { label: 'Refurbished', value: 'REFURBISHED' },
];

const fuelTypeOptions: FilterOption[] = [
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'Petrol', value: 'PETROL' },
  { label: 'Electric', value: 'ELECTRIC' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'LPG', value: 'LPG' },
  { label: 'CNG', value: 'CNG' },
  { label: 'Hydrogen', value: 'HYDROGEN' },
];

const transmissionOptions: FilterOption[] = [
  { label: 'Manual', value: 'MANUAL' },
  { label: 'Automatic', value: 'AUTOMATIC' },
  { label: 'Semi-Automatic', value: 'SEMI_AUTOMATIC' },
];

const countryOptions: FilterOption[] = [
  { label: 'Netherlands', value: 'NL' },
  { label: 'Germany', value: 'DE' },
  { label: 'Belgium', value: 'BE' },
  { label: 'France', value: 'FR' },
  { label: 'Poland', value: 'PL' },
  { label: 'Spain', value: 'ES' },
  { label: 'Italy', value: 'IT' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Austria', value: 'AT' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Denmark', value: 'DK' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'year-asc', label: 'Year: Oldest' },
];

// ---------------------------------------------------------------------------
// Fallback dummy data (when API is not available)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Map API sort param name to backend expected format
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
  // Handle images — API returns objects, frontend expects string[]
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
  // If no API images, use our image mapping based on title
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
    mileage: listing.mileageKm ?? undefined,
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
// SearchPage Component
// ---------------------------------------------------------------------------
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  // Data state
  const [listings, setListings] = useState<ListingCardData[]>(dummyListings);
  const [totalResults, setTotalResults] = useState(186);
  const [totalPages, setTotalPages] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce timer for search input
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Read filters from URL — normalize to API-compatible values
  // This handles both new format (slugs) and legacy format (display names)
  const query = searchParams.get('q') || '';
  const selectedCategories = searchParams.getAll('category').map(toSlug);
  const selectedBrands = searchParams.getAll('brand').map(toSlug);
  const selectedConditions = searchParams.getAll('condition').map((v) => v.toUpperCase());
  const selectedFuelTypes = searchParams.getAll('fuelType').map((v) => v.toUpperCase());
  const selectedTransmissions = searchParams.getAll('transmission').map((v) => v.toUpperCase().replace(/-/g, '_'));
  const selectedCountries = searchParams.getAll('country').map((v) => v.toUpperCase());
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';
  const yearMin = searchParams.get('yearMin') || '';
  const yearMax = searchParams.get('yearMax') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // ---------------------------------------------------------------------------
  // Fetch data from API (with fallback to dummy data)
  // ---------------------------------------------------------------------------
  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);

    try {
      // Build API query params — values are already in the correct format
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
        setListings(apiListings.length > 0 ? apiListings : dummyListings);
        setTotalResults(response.pagination?.total || apiListings.length);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.page || page);
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      // API unavailable — use filtered dummy data
      let filtered = [...dummyListings];

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((l) =>
          l.title.toLowerCase().includes(q) ||
          l.seller.name.toLowerCase().includes(q)
        );
      }
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((l) =>
          selectedCategories.some((c) => l.title.toLowerCase().includes(c.toLowerCase()))
        );
      }
      if (selectedBrands.length > 0) {
        filtered = filtered.filter((l) =>
          selectedBrands.some((b) => l.title.toLowerCase().includes(b.toLowerCase()))
        );
      }
      if (selectedConditions.length > 0) {
        filtered = filtered.filter((l) =>
          selectedConditions.some((c) => l.condition.toLowerCase() === c.toLowerCase())
        );
      }
      if (priceMin) {
        filtered = filtered.filter((l) => (l.price ?? 0) >= Number(priceMin));
      }
      if (priceMax) {
        filtered = filtered.filter((l) => (l.price ?? 0) <= Number(priceMax));
      }
      if (yearMin) {
        filtered = filtered.filter((l) => l.year >= Number(yearMin));
      }
      if (yearMax) {
        filtered = filtered.filter((l) => l.year <= Number(yearMax));
      }

      // Sort
      switch (sort) {
        case 'price-asc':
          filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
          break;
        case 'price-desc':
          filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
          break;
        case 'year-desc':
          filtered.sort((a, b) => b.year - a.year);
          break;
        case 'year-asc':
          filtered.sort((a, b) => a.year - b.year);
          break;
      }

      setListings(filtered);
      setTotalResults(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 24) || 1);
      setCurrentPage(page);
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

  const filteredBrands = brandOptions.filter((b) =>
    b.label.toLowerCase().includes(brandSearch.toLowerCase())
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
      <FilterSection title="Category">
        <div className="space-y-2">
          {categoryOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selectedCategories.includes(opt.value)}
              onCheckedChange={() => toggleArrayFilter('category', opt.value, selectedCategories)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <Input
          placeholder="Search brands..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="mb-3 h-8 text-xs"
        />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredBrands.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selectedBrands.includes(opt.value)}
              onCheckedChange={() => toggleArrayFilter('brand', opt.value, selectedBrands)}
            />
          ))}
        </div>
      </FilterSection>

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

      <FilterSection title="Condition">
        <div className="space-y-2">
          {conditionOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selectedConditions.includes(opt.value)}
              onCheckedChange={() => toggleArrayFilter('condition', opt.value, selectedConditions)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fuel Type" defaultOpen={false}>
        <div className="space-y-2">
          {fuelTypeOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selectedFuelTypes.includes(opt.value)}
              onCheckedChange={() => toggleArrayFilter('fuelType', opt.value, selectedFuelTypes)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission" defaultOpen={false}>
        <div className="space-y-2">
          {transmissionOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selectedTransmissions.includes(opt.value)}
              onCheckedChange={() =>
                toggleArrayFilter('transmission', opt.value, selectedTransmissions)
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Country" defaultOpen={false}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {countryOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selectedCountries.includes(opt.value)}
              onCheckedChange={() =>
                toggleArrayFilter('country', opt.value, selectedCountries)
              }
            />
          ))}
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
  // Active filter chips — show display labels, not raw values
  // ---------------------------------------------------------------------------
  const activeFilterChips: { label: string; onRemove: () => void }[] = [];

  selectedCategories.forEach((cat) => {
    activeFilterChips.push({
      label: `Category: ${findLabel(categoryOptions, cat)}`,
      onRemove: () => toggleArrayFilter('category', cat, selectedCategories),
    });
  });
  selectedBrands.forEach((brand) => {
    activeFilterChips.push({
      label: `Brand: ${findLabel(brandOptions, brand)}`,
      onRemove: () => toggleArrayFilter('brand', brand, selectedBrands),
    });
  });
  selectedConditions.forEach((cond) => {
    activeFilterChips.push({
      label: `Condition: ${findLabel(conditionOptions, cond)}`,
      onRemove: () => toggleArrayFilter('condition', cond, selectedConditions),
    });
  });
  selectedFuelTypes.forEach((fuel) => {
    activeFilterChips.push({
      label: `Fuel: ${findLabel(fuelTypeOptions, fuel)}`,
      onRemove: () => toggleArrayFilter('fuelType', fuel, selectedFuelTypes),
    });
  });
  selectedTransmissions.forEach((trans) => {
    activeFilterChips.push({
      label: `Transmission: ${findLabel(transmissionOptions, trans)}`,
      onRemove: () => toggleArrayFilter('transmission', trans, selectedTransmissions),
    });
  });
  selectedCountries.forEach((country) => {
    activeFilterChips.push({
      label: `Country: ${findLabel(countryOptions, country)}`,
      onRemove: () => toggleArrayFilter('country', country, selectedCountries),
    });
  });
  if (priceMin || priceMax) {
    activeFilterChips.push({
      label: `Price: ${priceMin || '0'} - ${priceMax || '...'}`,
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
