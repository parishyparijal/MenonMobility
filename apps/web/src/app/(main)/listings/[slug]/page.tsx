'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Heart,
  Share2,
  Printer,
  BarChart3,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Zap,
  Leaf,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { useFavoritesStore } from '@/store/favorites';
import { cn } from '@/lib/utils';
import { getImagesForListing, TRUCK_IMAGES } from '@/lib/images';

const dummyListing = {
  id: '1',
  slug: 'mercedes-actros-2545-ls-2022',
  title: 'Mercedes-Benz Actros 2545 LS 6x2 StreamSpace',
  description: `This Mercedes-Benz Actros 2545 LS is a well-maintained truck in excellent condition. The vehicle has been regularly serviced at authorized Mercedes-Benz service centers and comes with a complete service history.

Key highlights:
- Full service history at authorized dealers
- Euro 6 emission compliant
- Automatic gearbox (PowerShift 3)
- Predictive Powertrain Control (PPC)
- Active Brake Assist 5
- Multimedia Cockpit
- Air conditioning
- Cruise control
- 2 sleeping berths in StreamSpace cab
- LED headlights
- Excellent tyre condition (90% remaining)

The truck has been used primarily for long-haul transport within Western Europe and has been kept in top condition. Ideal for fleet operations or owner-operators looking for a reliable and fuel-efficient tractor unit.`,
  price: 89500,
  currency: 'EUR',
  condition: 'USED' as string,
  category: 'trucks',
  brand: 'Mercedes-Benz',
  model: 'Actros 2545 LS',
  year: 2022,
  mileage: 185000,
  fuelType: 'Diesel',
  transmission: 'Automatic',
  power: '330 kW (449 HP)',
  emissionClass: 'Euro 6',
  color: 'White',
  axleConfiguration: '6x2',
  gvw: '25,000 kg',
  wheelbase: '4,600 mm',
  cabType: 'StreamSpace',
  images: getImagesForListing('Mercedes-Benz Actros 2545 LS 6x2 StreamSpace'),
  location: {
    country: 'Netherlands',
    city: 'Rotterdam',
    region: 'South Holland',
  },
  seller: {
    id: 'seller-1',
    name: 'TransEuropa BV',
    slug: 'transeuropa-bv',
    isVerified: true,
    rating: 4.7,
    reviewCount: 128,
    memberSince: '2020',
    avatar: '',
    phone: '+31 10 123 4567',
  },
  isFeatured: true,
  views: 1247,
  favorites: 43,
  createdAt: '2024-01-15',
};

const specs = [
  { icon: Calendar, label: 'Year', value: String(dummyListing.year) },
  { icon: Gauge, label: 'Mileage', value: `${dummyListing.mileage.toLocaleString()} km` },
  { icon: Fuel, label: 'Fuel', value: dummyListing.fuelType },
  { icon: Cog, label: 'Transmission', value: dummyListing.transmission },
  { icon: Zap, label: 'Power', value: dummyListing.power },
  { icon: Leaf, label: 'Emission', value: dummyListing.emissionClass },
];

const specTable = [
  { group: 'General', items: [
    { label: 'Brand', value: 'Mercedes-Benz' },
    { label: 'Model', value: 'Actros 2545 LS' },
    { label: 'Condition', value: 'Used' },
    { label: 'Year', value: '2022' },
    { label: 'Color', value: 'White' },
  ]},
  { group: 'Engine & Drivetrain', items: [
    { label: 'Fuel Type', value: 'Diesel' },
    { label: 'Power', value: '330 kW (449 HP)' },
    { label: 'Transmission', value: 'Automatic (PowerShift 3)' },
    { label: 'Emission Class', value: 'Euro 6' },
    { label: 'Axle Configuration', value: '6x2' },
  ]},
  { group: 'Dimensions & Weight', items: [
    { label: 'Gross Vehicle Weight', value: '25,000 kg' },
    { label: 'Wheelbase', value: '4,600 mm' },
    { label: 'Cab Type', value: 'StreamSpace' },
  ]},
  { group: 'Performance', items: [
    { label: 'Mileage', value: '185,000 km' },
  ]},
];

const relatedListings: ListingCardData[] = [
  {
    id: '10',
    slug: 'volvo-fh-500-2023',
    title: 'Volvo FH 500 4x2 Globetrotter XL',
    price: 125000,
    currency: 'EUR',
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
    id: '11',
    slug: 'scania-r450-2021',
    title: 'Scania R 450 A4x2NA Highline',
    price: 78900,
    currency: 'EUR',
    condition: 'USED',
    images: getImagesForListing('Scania R 450 A4x2NA Highline'),
    year: 2021,
    mileage: 310000,
    fuelType: 'Diesel',
    location: { city: 'Antwerp', country: 'Belgium' },
    seller: { name: 'FleetPro NV' },
    isFeatured: false,
  },
  {
    id: '12',
    slug: 'man-tgx-18-510-2023',
    title: 'MAN TGX 18.510 4x2 BLS',
    price: 115000,
    currency: 'EUR',
    condition: 'NEW',
    images: getImagesForListing('MAN TGX 18.510 4x2 BLS'),
    year: 2023,
    mileage: 0,
    fuelType: 'Diesel',
    location: { city: 'Munich', country: 'Germany' },
    seller: { name: 'BavariaTruck AG' },
    isFeatured: false,
  },
  {
    id: '13',
    slug: 'daf-xf-480-2022',
    title: 'DAF XF 480 FT Space Cab',
    price: 92000,
    currency: 'EUR',
    condition: 'USED',
    images: getImagesForListing('DAF XF 480 FT Space Cab'),
    year: 2022,
    mileage: 220000,
    fuelType: 'Diesel',
    location: { city: 'Eindhoven', country: 'Netherlands' },
    seller: { name: 'DutchFleet BV' },
    isFeatured: false,
  },
];

export default function ListingDetailPage() {
  const params = useParams();
  const { toggleFavorite, isFavorited } = useFavoritesStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [loanAmount, setLoanAmount] = useState(dummyListing.price);
  const [loanTerm, setLoanTerm] = useState(60);

  const placeholderImages = dummyListing.images.length > 0 ? dummyListing.images : Array.from({ length: 6 }, (_, i) => '');

  const goToPrev = useCallback(() => {
    setCurrentImage((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentImage((prev) => Math.min(placeholderImages.length - 1, prev + 1));
  }, [placeholderImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrev, goToNext]);

  const favorited = isFavorited(dummyListing.id);
  const interestRate = 5.9;
  const monthlyPayment =
    (loanAmount * (interestRate / 100 / 12)) /
    (1 - Math.pow(1 + interestRate / 100 / 12, -loanTerm));

  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(dummyListing.price);

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-foreground transition-colors">Search</Link>
            <span>/</span>
            <Link href={`/search?category=${dummyListing.category}`} className="hover:text-foreground transition-colors capitalize">
              {dummyListing.category}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{dummyListing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column (60%) */}
          <div className="flex-1 lg:max-w-[60%] space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="relative aspect-[16/10] bg-muted">
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-full cursor-zoom-in"
                >
                  {dummyListing.images[currentImage] ? (
                    <img
                      src={dummyListing.images[currentImage]}
                      alt={`${dummyListing.title} - Image ${currentImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Gauge className="w-16 h-16" />
                    </div>
                  )}
                </button>
                {placeholderImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
                      disabled={currentImage === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white disabled:opacity-50 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(Math.min(placeholderImages.length - 1, currentImage + 1))}
                      disabled={currentImage === placeholderImages.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white disabled:opacity-50 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {dummyListing.isFeatured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-b from-accent-400 to-accent-600 text-white border border-accent-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.1)]">Featured</Badge>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {placeholderImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      'w-20 h-14 rounded-lg bg-muted flex-shrink-0 border-2 transition-colors overflow-hidden',
                      currentImage === i ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                    )}
                  >
                    {imgUrl && (
                      <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="flex flex-wrap gap-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center gap-2 bg-white rounded-lg border border-border px-3 py-2"
                >
                  <spec.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{spec.label}</p>
                    <p className="text-sm font-medium text-foreground">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line">
                  {dummyListing.description}
                </div>
              </CardContent>
            </Card>

            {/* Specifications Table */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {specTable.map((group) => (
                  <div key={group.group}>
                    <h4 className="text-sm font-semibold text-foreground mb-3">{group.group}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                      {group.items.map((item) => (
                        <div key={item.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">
                  {dummyListing.location.city}, {dummyListing.location.region}
                </p>
                <p className="text-muted-foreground text-sm">{dummyListing.location.country}</p>
                <div className="mt-4 h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                  Map placeholder
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (40%) - Sticky */}
          <div className="lg:w-[40%] space-y-4">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Price Card */}
              <Card>
                <CardContent className="pt-6">
                  <Badge variant={dummyListing.condition === 'NEW' ? 'success' : 'secondary'} className="mb-3">
                    {dummyListing.condition === 'NEW' ? 'New' : 'Used'}
                  </Badge>
                  <h1 className="text-xl font-bold text-foreground leading-tight mb-2">
                    {dummyListing.title}
                  </h1>
                  <p className="text-3xl font-bold text-accent">{formattedPrice}</p>
                  <p className="text-xs text-muted-foreground mt-1">Price excl. VAT</p>
                </CardContent>
              </Card>

              {/* Seller Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {dummyListing.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/sellers/${dummyListing.seller.slug}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {dummyListing.seller.name}
                        </Link>
                        {dummyListing.seller.isVerified && (
                          <Shield className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                          <span className="text-sm font-medium text-foreground">
                            {dummyListing.seller.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({dummyListing.seller.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Member since {dummyListing.seller.memberSince}
                  </p>

                  <div className="space-y-2.5">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {showPhone ? dummyListing.seller.phone : 'Show Phone Number'}
                    </Button>
                    <div className="flex gap-2">
                      <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-b from-green-400 to-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.2)] border border-green-300/30 hover:from-green-300 hover:to-green-500 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all">
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                      </button>
                      <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-b from-accent-400 to-accent-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.2)] border border-accent-300/30 hover:from-accent-300 hover:to-accent-500 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all">
                        <MessageSquare className="w-4 h-4" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleFavorite(dummyListing.id)}
                >
                  <Heart className={cn('w-4 h-4 mr-1.5', favorited && 'fill-red-500 text-red-500')} />
                  {favorited ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-1.5" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  Compare
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4" />
                </Button>
              </div>

              {/* Finance Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Finance Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Loan Amount</label>
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-muted-foreground">Term</label>
                      <span className="text-xs font-medium text-foreground">{loanTerm} months</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={84}
                      step={12}
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>12</span>
                      <span>84</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Estimated Monthly Payment</p>
                    <p className="text-2xl font-bold text-accent mt-1">
                      {new Intl.NumberFormat('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      }).format(monthlyPayment)}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Based on {interestRate}% APR. For illustration only.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Related Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </div>

      {/* Fullscreen Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-black/95 rounded-none sm:rounded-xl overflow-hidden" size="xl">
          <div className="relative flex items-center justify-center w-full h-[85vh]">
            {placeholderImages[currentImage] ? (
              <img
                src={placeholderImages[currentImage]}
                alt={`${dummyListing.title} - Image ${currentImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-white/50">
                <Gauge className="w-24 h-24" />
              </div>
            )}

            {/* Navigation Arrows */}
            {placeholderImages.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  disabled={currentImage === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentImage === placeholderImages.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 text-white text-sm">
              {currentImage + 1} / {placeholderImages.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto justify-center bg-black/95">
            {placeholderImages.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={cn(
                  'w-16 h-11 rounded flex-shrink-0 border-2 transition-all overflow-hidden',
                  currentImage === i ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
                )}
              >
                {imgUrl && (
                  <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
