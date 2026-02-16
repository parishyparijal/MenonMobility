'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ListingCard, type ListingCardData } from '@/components/listings/listing-card';
import { StarRating } from '@/components/common/star-rating';
import { Pagination } from '@/components/common/pagination';
import { getImagesForListing } from '@/lib/images';

const dummySeller = {
  id: 'seller-1',
  slug: 'transeuropa-bv',
  name: 'TransEuropa BV',
  description: `TransEuropa BV is one of the leading commercial vehicle dealers in the Netherlands, specializing in trucks and tractor units from major manufacturers worldwide. With over 15 years of experience in the industry, we pride ourselves on offering high-quality, thoroughly inspected vehicles at competitive prices.

Our team of expert mechanics performs a comprehensive 150-point inspection on every vehicle before it goes on sale. We offer flexible financing options and can arrange international delivery to countries worldwide.

We are an authorized dealer for Mercedes-Benz, Volvo, and DAF commercial vehicles.`,
  logo: '',
  isVerified: true,
  rating: 4.7,
  reviewCount: 128,
  memberSince: '2020',
  location: {
    address: 'Industrieweg 45',
    city: 'Rotterdam',
    region: 'South Holland',
    country: 'Netherlands',
    postalCode: '3045 AH',
  },
  phone: '+31 10 123 4567',
  email: 'info@transeuropa.nl',
  website: 'https://transeuropa.nl',
  hours: [
    { day: 'Monday - Friday', hours: '08:00 - 18:00' },
    { day: 'Saturday', hours: '09:00 - 14:00' },
    { day: 'Sunday', hours: 'Closed' },
  ],
  listingCount: 67,
};

const sellerListings: ListingCardData[] = Array.from({ length: 8 }, (_, i) => ({
  id: `seller-listing-${i}`,
  slug: `seller-listing-${i}`,
  title: [
    'Mercedes-Benz Actros 2545 LS 6x2',
    'Volvo FH 500 4x2 Globetrotter',
    'DAF XF 480 FT Space Cab',
    'Scania R 450 Highline',
  ][i % 4],
  price: [89500, 125000, 92000, 78900][i % 4],
  currency: 'USD',
  condition: (i % 3 === 0 ? 'NEW' : 'USED') as 'NEW' | 'USED',
  images: getImagesForListing([
    'Mercedes-Benz Actros 2545 LS 6x2',
    'Volvo FH 500 4x2 Globetrotter',
    'DAF XF 480 FT Space Cab',
    'Scania R 450 Highline',
  ][i % 4]),
  year: 2020 + (i % 4),
  mileage: i % 3 === 0 ? 0 : 80000 + i * 30000,
  fuelType: 'Diesel',
  location: { city: 'Rotterdam', country: 'Netherlands' },
  seller: { name: 'TransEuropa BV' },
  isFeatured: i < 2,
}));

const dummyReviews = [
  {
    id: '1',
    author: 'Jan de Vries',
    rating: 5,
    date: '2024-01-15',
    text: 'Excellent experience purchasing a truck from TransEuropa. The vehicle was exactly as described and the team was very professional. Highly recommended!',
  },
  {
    id: '2',
    author: 'Klaus Mueller',
    rating: 4,
    date: '2024-01-08',
    text: 'Good selection of trucks. The buying process was smooth, though delivery took a bit longer than expected. Overall satisfied with the purchase.',
  },
  {
    id: '3',
    author: 'Pierre Dupont',
    rating: 5,
    date: '2023-12-20',
    text: 'Second purchase from TransEuropa. Always reliable and fair pricing. The after-sales support is also very good.',
  },
  {
    id: '4',
    author: 'Marco Rossi',
    rating: 4,
    date: '2023-12-05',
    text: 'Bought a Volvo FH from them. Good condition, fair price. Communication was clear throughout the entire process.',
  },
  {
    id: '5',
    author: 'Anna Kowalski',
    rating: 5,
    date: '2023-11-18',
    text: 'Very professional dealer. All documentation was in order and the truck passed our inspection with flying colors.',
  },
];

export default function SellerProfilePage() {
  const params = useParams();
  const [listingsPage, setListingsPage] = useState(1);

  return (
    <div className="bg-background min-h-screen">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-primary to-primary-950 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center text-3xl font-bold text-white shrink-0">
              {dummySeller.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{dummySeller.name}</h1>
                {dummySeller.isVerified && (
                  <Badge className="bg-white/20 text-white border-0">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium text-white">{dummySeller.rating}</span>
                  <span>({dummySeller.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {dummySeller.location.city}, {dummySeller.location.country}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {dummySeller.memberSince}
                </div>
              </div>
              <p className="text-accent font-medium mt-2">
                {dummySeller.listingCount} active listings
              </p>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
              <Phone className="w-4 h-4 mr-2" />
              {dummySeller.phone}
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white border-0" asChild>
              <a href={dummySeller.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Website
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="listings">
          <TabsList>
            <TabsTrigger value="listings">Active Listings ({dummySeller.listingCount})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({dummySeller.reviewCount})</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sellerListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={listingsPage}
                totalPages={Math.ceil(dummySeller.listingCount / 12)}
                onPageChange={setListingsPage}
              />
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-4">About {dummySeller.name}</h3>
                    <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line">
                      {dummySeller.description}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Business Hours
                    </h3>
                    <div className="space-y-2">
                      {dummySeller.hours.map((h) => (
                        <div key={h.day} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{h.day}</span>
                          <span className="font-medium text-foreground">{h.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </h3>
                    <div className="text-sm text-foreground space-y-1">
                      <p>{dummySeller.location.address}</p>
                      <p>{dummySeller.location.postalCode} {dummySeller.location.city}</p>
                      <p>{dummySeller.location.region}, {dummySeller.location.country}</p>
                    </div>
                    <div className="mt-4 h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                      Map placeholder
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {/* Rating Summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">{dummySeller.rating}</p>
                      <StarRating value={Math.round(dummySeller.rating)} size="md" />
                      <p className="text-sm text-muted-foreground mt-1">{dummySeller.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-3">{star}</span>
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review List */}
              {dummyReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{review.author}</p>
                          <StarRating value={review.rating} size="sm" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
