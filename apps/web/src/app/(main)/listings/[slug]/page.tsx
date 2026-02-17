'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Loader2,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { ChatWidget } from '@/components/chat/chat-widget';
import { useFavoritesStore } from '@/store/favorites';
import { useMessagesStore } from '@/store/messages';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';
import { getImagesForListing } from '@/lib/images';
import { api } from '@/lib/api';

/* ─── Helpers ─── */

function getJsonName(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val.en || Object.values(val)[0] || '';
}

function getCountryName(code: string): string {
  if (!code) return '';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
}

function formatEmission(ec: string | null): string {
  if (!ec) return '';
  return ec.replace(/^EURO/, 'Euro ');
}

function buildPowerString(kw: number | null, hp: number | null): string {
  if (kw && hp) return `${kw} kW (${hp} HP)`;
  if (hp) return `${hp} HP`;
  if (kw) return `${kw} kW`;
  return '';
}

interface MappedListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  power: string;
  emissionClass: string;
  color: string;
  images: string[];
  location: { country: string; city: string; region: string };
  seller: {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    memberSince: string;
    avatar: string;
    phone: string;
  };
  isFeatured: boolean;
  views: number;
  favorites: number;
  createdAt: string;
  specTable: { group: string; items: { label: string; value: string }[] }[];
  priceOnRequest: boolean;
  priceNegotiable: boolean;
}

function mapApiToListing(data: any): MappedListing {
  // Images
  let images: string[] = [];
  if (data.images && Array.isArray(data.images)) {
    images = data.images
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((img: any) => img.mediumUrl || img.largeUrl || img.originalUrl)
      .filter(Boolean);
  }
  if (images.length === 0) {
    images = getImagesForListing(data.title || '');
  }

  const power = buildPowerString(data.powerKw, data.powerHp);
  const emission = formatEmission(data.emissionClass);

  // Seller
  const sp = data.seller?.sellerProfile;
  const seller = {
    id: data.seller?.id || '',
    name: sp?.companyName || data.seller?.name || 'Dealer',
    slug: sp?.slug || '',
    isVerified: sp?.isVerified || false,
    rating: sp?.rating || 0,
    reviewCount: sp?.reviewCount || 0,
    memberSince: data.seller?.createdAt
      ? new Date(data.seller.createdAt).getFullYear().toString()
      : '',
    avatar: sp?.logoUrl || '',
    phone: data.contactPhone || data.seller?.phone || '',
  };

  // Build spec table from core fields + specifications array
  const coreSpecTable: { group: string; items: { label: string; value: string }[] }[] = [
    {
      group: 'General',
      items: [
        data.brand?.name && { label: 'Brand', value: data.brand.name },
        data.model?.name && { label: 'Model', value: data.model.name },
        data.condition && {
          label: 'Condition',
          value: data.condition === 'NEW' ? 'New' : data.condition === 'REFURBISHED' ? 'Refurbished' : 'Used',
        },
        data.year && { label: 'Year', value: String(data.year) },
        data.color && { label: 'Color', value: data.color },
      ].filter(Boolean) as { label: string; value: string }[],
    },
    {
      group: 'Engine & Drivetrain',
      items: [
        data.fuelType && { label: 'Fuel Type', value: data.fuelType },
        power && { label: 'Power', value: power },
        data.transmission && { label: 'Transmission', value: data.transmission },
        emission && { label: 'Emission Class', value: emission },
        data.axleCount && { label: 'Axles', value: String(data.axleCount) },
      ].filter(Boolean) as { label: string; value: string }[],
    },
    {
      group: 'Dimensions & Weight',
      items: [
        data.gvwKg && { label: 'Gross Vehicle Weight', value: `${Number(data.gvwKg).toLocaleString()} kg` },
        data.payloadKg && { label: 'Payload', value: `${Number(data.payloadKg).toLocaleString()} kg` },
        data.wheelbaseMm && { label: 'Wheelbase', value: `${Number(data.wheelbaseMm).toLocaleString()} mm` },
        data.cabType && { label: 'Cab Type', value: data.cabType },
        data.suspensionType && { label: 'Suspension', value: data.suspensionType },
      ].filter(Boolean) as { label: string; value: string }[],
    },
    {
      group: 'Performance',
      items: [
        data.mileageKm != null && data.mileageKm > 0 && {
          label: 'Mileage',
          value: `${Number(data.mileageKm).toLocaleString()} km`,
        },
        data.operatingHours && {
          label: 'Operating Hours',
          value: `${Number(data.operatingHours).toLocaleString()} hrs`,
        },
      ].filter(Boolean) as { label: string; value: string }[],
    },
  ].filter((g) => g.items.length > 0);

  // Add custom specifications from the specifications array
  if (data.specifications && Array.isArray(data.specifications) && data.specifications.length > 0) {
    const specItems = data.specifications.map((spec: any) => ({
      label: getJsonName(spec.specKey?.name) || 'Spec',
      value: spec.value + (spec.specKey?.unit ? ` ${spec.specKey.unit}` : ''),
    }));
    coreSpecTable.push({ group: 'Additional Specifications', items: specItems });
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title || '',
    description: data.description || '',
    price: data.price ? Number(data.price) : 0,
    currency: data.priceCurrency || 'USD',
    condition: data.condition || 'USED',
    category: data.category?.slug || getJsonName(data.category?.name).toLowerCase() || '',
    brand: data.brand?.name || '',
    model: data.model?.name || '',
    year: data.year || 0,
    mileage: data.mileageKm ?? 0,
    fuelType: data.fuelType || '',
    transmission: data.transmission || '',
    power,
    emissionClass: emission,
    color: data.color || '',
    images,
    location: {
      country: getCountryName(data.countryCode || ''),
      city: data.city || '',
      region: data.region || '',
    },
    seller,
    isFeatured: data.isFeatured || false,
    views: data.viewCount || 0,
    favorites: data.favoriteCount || 0,
    createdAt: data.createdAt || '',
    specTable: coreSpecTable,
    priceOnRequest: data.priceOnRequest || false,
    priceNegotiable: data.priceNegotiable || false,
  };
}

function mapApiToCard(data: any): ListingCardData {
  let images: string[] = [];
  if (data.images && Array.isArray(data.images)) {
    if (typeof data.images[0] === 'string') {
      images = data.images;
    } else {
      images = data.images
        .map((img: any) => img.mediumUrl || img.thumbnailUrl || img.originalUrl)
        .filter(Boolean);
    }
  }
  if (images.length === 0) {
    images = getImagesForListing(data.title || '');
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    price: data.price ? Number(data.price) : 0,
    currency: data.priceCurrency || 'USD',
    condition: data.condition || 'USED',
    images,
    year: data.year,
    mileage: data.mileageKm ?? undefined,
    fuelType: data.fuelType,
    location: {
      city: data.city || '',
      country: data.countryCode || '',
    },
    seller: {
      name:
        data.seller?.sellerProfile?.companyName ||
        data.seller?.name ||
        data.sellerName ||
        'Dealer',
    },
    isFeatured: data.isFeatured,
  };
}

/* ─── Fallback dummy data (shown if API fails) ─── */

const FALLBACK_LISTING: MappedListing = {
  id: 'fallback',
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
  currency: 'USD',
  condition: 'USED',
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
  images: getImagesForListing('Mercedes-Benz Actros 2545 LS 6x2 StreamSpace'),
  location: { country: 'Netherlands', city: 'Rotterdam', region: 'South Holland' },
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
  specTable: [
    {
      group: 'General',
      items: [
        { label: 'Brand', value: 'Mercedes-Benz' },
        { label: 'Model', value: 'Actros 2545 LS' },
        { label: 'Condition', value: 'Used' },
        { label: 'Year', value: '2022' },
        { label: 'Color', value: 'White' },
      ],
    },
    {
      group: 'Engine & Drivetrain',
      items: [
        { label: 'Fuel Type', value: 'Diesel' },
        { label: 'Power', value: '330 kW (449 HP)' },
        { label: 'Transmission', value: 'Automatic (PowerShift 3)' },
        { label: 'Emission Class', value: 'Euro 6' },
        { label: 'Axle Configuration', value: '6x2' },
      ],
    },
    {
      group: 'Dimensions & Weight',
      items: [
        { label: 'Gross Vehicle Weight', value: '25,000 kg' },
        { label: 'Wheelbase', value: '4,600 mm' },
        { label: 'Cab Type', value: 'StreamSpace' },
      ],
    },
    {
      group: 'Performance',
      items: [{ label: 'Mileage', value: '185,000 km' }],
    },
  ],
  priceOnRequest: false,
  priceNegotiable: false,
};

const FALLBACK_RELATED: ListingCardData[] = [
  {
    id: '10',
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
  },
  {
    id: '11',
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
  },
  {
    id: '12',
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
    isFeatured: false,
  },
  {
    id: '13',
    slug: 'daf-xf-480-2022',
    title: 'DAF XF 480 FT Space Cab',
    price: 92000,
    currency: 'USD',
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

/* ─── Component ─── */

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { toggleFavorite, isFavorited } = useFavoritesStore();
  const { sendFirstMessage, isSending } = useMessagesStore();
  const { isAuthenticated } = useAuthStore();

  const [listing, setListing] = useState<MappedListing | null>(null);
  const [relatedCards, setRelatedCards] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageError, setMessageError] = useState('');
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);

  // Fetch listing detail + related
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await api.get<any>(`/listings/${slug}`);
        if (!cancelled && response?.success && response.data) {
          setListing(mapApiToListing(response.data));
        } else if (!cancelled) {
          setListing(FALLBACK_LISTING);
        }
      } catch {
        if (!cancelled) setListing(FALLBACK_LISTING);
      }

      try {
        const relRes = await api.get<any>(`/listings/${slug}/related`);
        if (!cancelled && relRes?.success && Array.isArray(relRes.data)) {
          const mapped = relRes.data.map(mapApiToCard);
          setRelatedCards(mapped.length > 0 ? mapped : FALLBACK_RELATED);
        } else if (!cancelled) {
          setRelatedCards(FALLBACK_RELATED);
        }
      } catch {
        if (!cancelled) setRelatedCards(FALLBACK_RELATED);
      }

      if (!cancelled) setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [slug]);

  // Derived values (safe because we guard on loading/listing null below)
  const loanPrice = listing?.price || 0;
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60);

  // Sync loan amount when listing loads
  useEffect(() => {
    if (listing) setLoanAmount(listing.price);
  }, [listing]);

  const isFallback = listing?.id === 'fallback';

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending || !listing || isFallback) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setMessageError('');
    try {
      const { threadId } = await sendFirstMessage(listing.id, messageText.trim());
      setMessageText('');
      setMessageDialogOpen(false);
      setChatThreadId(threadId);
    } catch {
      setMessageError('Failed to send message. Please try again.');
    }
  };

  const goToPrev = useCallback(() => {
    setCurrentImage((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentImage((prev) =>
      Math.min((listing?.images.length || 1) - 1, prev + 1)
    );
  }, [listing]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrev, goToNext]);

  /* ─── Loading skeleton ─── */
  if (loading || !listing) {
    return (
      <div className="bg-background min-h-screen">
        <div className="bg-white border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 lg:max-w-[60%] space-y-6">
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="aspect-[16/10] bg-muted animate-pulse" />
                <div className="flex gap-2 p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-20 h-14 rounded-lg bg-muted animate-pulse flex-shrink-0" />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-14 w-32 bg-white rounded-lg border border-border animate-pulse" />
                ))}
              </div>
              <Card>
                <CardHeader><div className="h-6 w-32 bg-muted rounded animate-pulse" /></CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${80 - i * 8}%` }} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:w-[40%] space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
                    <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Derived display values ─── */

  const placeholderImages = listing.images.length > 0 ? listing.images : Array.from({ length: 6 }, () => '');
  const favorited = isFavorited(listing.id);
  const interestRate = 5.9;
  const monthlyPayment =
    (loanAmount * (interestRate / 100 / 12)) /
    (1 - Math.pow(1 + interestRate / 100 / 12, -loanTerm));

  const formattedPrice = listing.priceOnRequest
    ? 'Price on Request'
    : new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: listing.currency || 'USD',
        maximumFractionDigits: 0,
      }).format(listing.price);

  // Build quick specs dynamically
  const specs = [
    listing.year && { icon: Calendar, label: 'Year', value: String(listing.year) },
    listing.mileage > 0 && { icon: Gauge, label: 'Mileage', value: `${listing.mileage.toLocaleString()} km` },
    listing.fuelType && { icon: Fuel, label: 'Fuel', value: listing.fuelType },
    listing.transmission && { icon: Cog, label: 'Transmission', value: listing.transmission },
    listing.power && { icon: Zap, label: 'Power', value: listing.power },
    listing.emissionClass && { icon: Leaf, label: 'Emission', value: listing.emissionClass },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

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
            <Link href={`/search?category=${listing.category}`} className="hover:text-foreground transition-colors capitalize">
              {listing.category}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{listing.title}</span>
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
                  {listing.images[currentImage] ? (
                    <img
                      src={listing.images[currentImage]}
                      alt={`${listing.title} - Image ${currentImage + 1}`}
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
                {listing.isFeatured && (
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
            {specs.length > 0 && (
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
            )}

            {/* Description */}
            {listing.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line">
                    {listing.description}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specifications Table */}
            {listing.specTable.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {listing.specTable.map((group) => (
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
            )}

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
                  {[listing.location.city, listing.location.region].filter(Boolean).join(', ')}
                </p>
                <p className="text-muted-foreground text-sm">{listing.location.country}</p>
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
                  <Badge variant={listing.condition === 'NEW' ? 'success' : 'secondary'} className="mb-3">
                    {listing.condition === 'NEW' ? 'New' : listing.condition === 'REFURBISHED' ? 'Refurbished' : 'Used'}
                  </Badge>
                  <h1 className="text-xl font-bold text-foreground leading-tight mb-2">
                    {listing.title}
                  </h1>
                  <p className="text-3xl font-bold text-accent">{formattedPrice}</p>
                  {!listing.priceOnRequest && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Price excl. VAT{listing.priceNegotiable ? ' · Negotiable' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Seller Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden">
                      {listing.seller.avatar ? (
                        <img src={listing.seller.avatar} alt={listing.seller.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {listing.seller.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/sellers/${listing.seller.slug || listing.seller.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {listing.seller.name}
                        </Link>
                        {listing.seller.isVerified && (
                          <Shield className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      {listing.seller.rating > 0 && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span className="text-sm font-medium text-foreground">
                              {listing.seller.rating}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({listing.seller.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {listing.seller.memberSince && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Member since {listing.seller.memberSince}
                    </p>
                  )}

                  <div className="space-y-2.5">
                    {listing.seller.phone && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setShowPhone(!showPhone)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {showPhone ? listing.seller.phone : 'Show Phone Number'}
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-b from-green-500 to-green-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_3px_rgba(0,0,0,0.12)] border border-green-400/30 hover:from-green-400 hover:to-green-600 active:from-green-600 active:to-green-800 transition-all">
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            router.push('/login');
                            return;
                          }
                          if (isFallback) return;
                          // If we already have a chat thread, just reopen the widget
                          if (chatThreadId) {
                            setChatThreadId(chatThreadId);
                            return;
                          }
                          setMessageError('');
                          setMessageDialogOpen(true);
                        }}
                        disabled={isFallback}
                        className={cn(
                          'flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-b from-accent-400 to-accent-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_3px_rgba(0,0,0,0.12)] border border-accent-300/40 hover:from-accent-300 hover:to-accent-500 active:from-accent-500 active:to-accent-700 transition-all',
                          isFallback && 'opacity-50 cursor-not-allowed'
                        )}
                        title={isFallback ? 'Listing not available — cannot send messages' : undefined}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {isFallback ? 'Unavailable' : 'Send Message'}
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
                  onClick={() => toggleFavorite(listing.id)}
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
              {!listing.priceOnRequest && listing.price > 0 && (
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
                          currency: listing.currency || 'USD',
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
              )}
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedCards.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-6">Related Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCards.map((rl) => (
                <ListingCard key={rl.id} listing={rl} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Send Message</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Message to {listing.seller.name} about {listing.title}
              </p>
            </div>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Hi, I'm interested in your ${listing.title}. Is it still available?`}
              rows={4}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {messageError && (
              <p className="text-sm text-red-500">{messageError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSending}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <Send className="w-4 h-4 mr-1.5" />
                )}
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Widget */}
      {chatThreadId && (
        <ChatWidget
          threadId={chatThreadId}
          listingTitle={listing.title}
          sellerName={listing.seller.name}
          onClose={() => setChatThreadId(null)}
        />
      )}

      {/* Fullscreen Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-black/95 rounded-none sm:rounded-xl overflow-hidden" size="xl">
          <div className="relative flex items-center justify-center w-full h-[85vh]">
            {placeholderImages[currentImage] ? (
              <img
                src={placeholderImages[currentImage]}
                alt={`${listing.title} - Image ${currentImage + 1}`}
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
