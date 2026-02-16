'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Truck,
  Container,
  Wrench,
  Car,
  Tractor,
  Package,
  Building2,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageSquare,
  FileCheck,
  ArrowRight,
  BarChart3,
  Users,
  Globe,
  CalendarCheck,
  MapPin,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { getImagesForListing, BRAND_LOGOS } from '@/lib/images';
import { getLocalizedText } from '@/lib/i18n-helpers';
import { api } from '@/lib/api';

// Map category slugs to icons
const categoryIconMap: Record<string, LucideIcon> = {
  trucks: Truck,
  trailers: Container,
  construction: Building2,
  vans: Car,
  cars: Car,
  containers: Package,
  parts: Wrench,
  agricultural: Tractor,
};

interface CategoryItem {
  name: string;
  slug: string;
  icon: LucideIcon;
}

const fallbackCategories: CategoryItem[] = [
  { name: 'Trucks', slug: 'trucks', icon: Truck },
  { name: 'Trailers', slug: 'trailers', icon: Container },
  { name: 'Construction', slug: 'construction', icon: Building2 },
  { name: 'Vans', slug: 'vans', icon: Car },
  { name: 'Cars', slug: 'cars', icon: Car },
  { name: 'Containers', slug: 'containers', icon: Package },
  { name: 'Parts', slug: 'parts', icon: Wrench },
  { name: 'Agricultural', slug: 'agricultural', icon: Tractor },
];

const featuredListings: ListingCardData[] = [
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
    isFeatured: true,
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
    isFeatured: true,
  },
  {
    id: '4',
    slug: 'man-tgx-18-510-2023',
    title: 'MAN TGX 18.510 4x2 BLS',
    price: 115000,
    currency: 'USD',
    condition: 'NEW',
    images: getImagesForListing('MAN TGX 18.510 4x2 BLS'),
    year: 2023,
    mileage: 0,
    fuelType: 'Diesel',
    location: { city: 'Munich', country: 'Germany' },
    seller: { name: 'BavariaTruck AG' },
    isFeatured: true,
  },
  {
    id: '5',
    slug: 'bmw-5-series-530d-2023',
    title: 'BMW 5 Series 530d xDrive Touring',
    price: 52000,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('BMW 5 Series 530d xDrive Touring'),
    year: 2023,
    mileage: 35000,
    fuelType: 'Diesel',
    location: { city: 'Munich', country: 'Germany' },
    seller: { name: 'BMW Premium Select' },
    isFeatured: true,
  },
  {
    id: '6',
    slug: 'caterpillar-320-2021',
    title: 'Caterpillar 320 GC Excavator',
    price: 165000,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('Caterpillar 320 GC Excavator'),
    year: 2021,
    mileage: 4500,
    fuelType: 'Diesel',
    location: { city: 'Warsaw', country: 'Poland' },
    seller: { name: 'EuroBuild Sp.' },
    isFeatured: true,
  },
  {
    id: '7',
    slug: 'schmitz-curtainsider-2022',
    title: 'Schmitz Cargobull Curtainsider SCS 24/L',
    price: 32000,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('Schmitz Cargobull Curtainsider SCS 24/L'),
    year: 2022,
    mileage: 0,
    fuelType: 'N/A',
    location: { city: 'Bremen', country: 'Germany' },
    seller: { name: 'TrailerPoint GmbH' },
    isFeatured: true,
  },
  {
    id: '8',
    slug: 'mercedes-sprinter-316-2023',
    title: 'Mercedes-Benz Sprinter 316 CDI L3H2',
    price: 38500,
    currency: 'USD',
    condition: 'USED',
    images: getImagesForListing('Mercedes-Benz Sprinter 316 CDI L3H2'),
    year: 2023,
    mileage: 42000,
    fuelType: 'Diesel',
    location: { city: 'Amsterdam', country: 'Netherlands' },
    seller: { name: 'VanCenter BV' },
    isFeatured: true,
  },
];

const popularBrands = [
  'Mercedes-Benz',
  'Volvo',
  'Scania',
  'MAN',
  'DAF',
  'Caterpillar',
  'Iveco',
  'Renault',
];

const stats = [
  { label: 'Listings', value: 150000, suffix: '+', icon: BarChart3 },
  { label: 'Dealers', value: 5000, suffix: '+', icon: Users },
  { label: 'Countries', value: 50, suffix: '+', icon: Globe },
  { label: 'Since', value: 2024, suffix: '', icon: CalendarCheck },
];

function StatItem({ stat }: { stat: typeof stats[number] }) {
  const { count, ref } = useCountUp(stat.value);
  const Icon = stat.icon;
  const display = stat.value >= 1000
    ? `${Math.floor(count / 1000)}K${stat.suffix}`
    : `${count}${stat.suffix}`;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 py-2">
      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
        <Icon className="w-6 h-6 text-white/90" />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-white tabular-nums">{display}</p>
      <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>(fallbackCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch categories from API
  useEffect(() => {
    api.get<{ success: boolean; data: Array<{ name: unknown; slug: string }> }>('/categories?flat=true')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((cat) => ({
            name: getLocalizedText(cat.name),
            slug: cat.slug,
            icon: categoryIconMap[cat.slug] || Package,
          }));
          setCategories(mapped);
        }
      })
      .catch(() => {
        // Keep fallback categories
      });
  }, []);

  const visibleCount = 4;
  const maxIndex = Math.max(0, featuredListings.length - visibleCount);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/85 via-primary/70 to-primary-800/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-10 -right-32 w-80 h-80 bg-primary-300/20 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-sm text-white/90 font-medium">Trusted by 5,000+ dealers in 50+ countries</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Find Your Next
              <span className="block bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent">
                Commercial Vehicle
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              The world&apos;s largest marketplace for trucks, trailers, construction equipment
              and commercial vehicles from verified dealers.
            </p>

            {/* Search Bar - Glassmorphism */}
            <form onSubmit={handleSearch} className="bg-white/[0.12] backdrop-blur-xl rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto border border-white/20 ring-1 ring-white/10">
              <div className="relative min-w-[160px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 w-full px-4 rounded-xl bg-white text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by brand, model, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button type="submit" variant="accent" size="lg" className="h-12 px-8 rounded-xl font-semibold text-base shadow-lg shadow-accent/25">
                Search
              </Button>
            </form>

            {/* Quick stats row */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-10 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span><strong className="text-white/80">150K+</strong> listings</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span><strong className="text-white/80">Verified</strong> dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span><strong className="text-white/80">50+</strong> countries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade into category section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Category Icons Grid */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-border hover:shadow-lg hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center group-hover:from-accent/10 group-hover:to-accent/20 transition-all duration-200 shadow-sm">
                <cat.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-200" />
              </div>
              <span className="text-xs font-semibold text-foreground text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Carousel */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Listings</h2>
            <p className="text-muted-foreground mt-1">Hand-picked vehicles from verified dealers</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
              disabled={carouselIndex === 0}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCarouselIndex(Math.min(maxIndex, carouselIndex + 1))}
              disabled={carouselIndex >= maxIndex}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300"
            style={{ transform: `translateX(-${carouselIndex * (100 / visibleCount)}%)` }}
          >
            {featuredListings.map((listing) => (
              <div key={listing.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/search">
              View All Listings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative bg-gradient-to-r from-primary-800 via-primary to-primary-950 text-white overflow-hidden">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="container mx-auto px-4 py-14 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index < stats.length - 1
                    ? 'md:border-r md:border-white/10'
                    : ''
                }
              >
                <StatItem stat={stat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Popular Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {popularBrands.map((brand) => (
            <Link
              key={brand}
              href={`/search?brand=${encodeURIComponent(brand)}`}
              className="flex items-center justify-center h-20 bg-white rounded-xl border border-border hover:shadow-md hover:border-primary transition-all px-4 group"
            >
              {BRAND_LOGOS[brand] ? (
                <img
                  src={BRAND_LOGOS[brand]}
                  alt={brand}
                  className="h-10 max-w-[90%] object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-sm font-semibold text-foreground">{brand}</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-4">
            Why Choose Menon Mobility?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            The safest and most reliable way to buy and sell commercial vehicles worldwide
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-0 shadow-none bg-background">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Verified Dealers</h3>
                <p className="text-sm text-muted-foreground">
                  All dealers are verified and reviewed. Buy with confidence knowing you are dealing
                  with trusted professionals.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-background">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure Messaging</h3>
                <p className="text-sm text-muted-foreground">
                  Communicate directly with sellers through our secure in-app messaging system.
                  No spam, no hassle.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-background">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Vehicle History</h3>
                <p className="text-sm text-muted-foreground">
                  Access detailed vehicle history reports and documentation for informed purchasing
                  decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dealer CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-accent to-accent-600 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Are you a dealer?</h2>
            <p className="text-white/90 text-lg">
              Start selling today and reach thousands of buyers worldwide.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-accent hover:bg-white/90 font-semibold px-8 shrink-0"
            asChild
          >
            <Link href="/register">
              Register Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
