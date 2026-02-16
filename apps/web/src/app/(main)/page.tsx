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
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/55 to-primary-950/45" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              The World&apos;s Leading Commercial Vehicle Marketplace
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Buy and sell trucks, trailers, construction equipment and more from trusted dealers
              across 50+ countries worldwide.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl max-w-2xl mx-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 px-4 rounded-lg border border-border bg-white text-foreground text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search by brand, model, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 px-4 rounded-lg border border-border bg-white text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" variant="accent" size="lg" className="h-12 px-8">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Icons Grid */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-border hover:shadow-md hover:border-accent transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <cat.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
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
