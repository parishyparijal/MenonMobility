'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Gauge, Fuel } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { useFavoritesStore } from '@/store/favorites';
import { cn } from '@/lib/utils';

export interface ListingCardData {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency?: string;
  condition: 'NEW' | 'USED';
  images: string[];
  year: number;
  mileage?: number;
  fuelType?: string;
  location: {
    city: string;
    country: string;
  };
  seller: {
    name: string;
  };
  isFeatured?: boolean;
}

interface ListingCardProps {
  listing: ListingCardData;
  view?: 'grid' | 'list';
}

export function ListingCard({ listing, view = 'grid' }: ListingCardProps) {
  const { toggleFavorite, isFavorited } = useFavoritesStore();
  const favorited = isFavorited(listing.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  if (view === 'list') {
    return (
      <Link href={`/listings/${listing.slug}`} className="block group">
        <div className="flex gap-4 bg-white rounded-2xl border border-border p-3 hover:shadow-lg hover:border-border/80 transition-all duration-200">
          <div className="relative w-64 h-44 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
            {listing.images[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Gauge className="w-12 h-12" />
              </div>
            )}
            {listing.isFeatured && (
              <Badge className="absolute top-2.5 left-2.5 bg-gradient-to-b from-accent-400 to-accent-600 text-white border border-accent-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.1)]">
                Featured
              </Badge>
            )}
            <span
              className={cn(
                'absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm',
                listing.condition === 'NEW'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/90 text-foreground backdrop-blur-sm'
              )}
            >
              {listing.condition === 'NEW' ? 'New' : 'Used'}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-base">
                {listing.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {listing.year}
                </span>
                {listing.mileage != null && listing.mileage > 0 && (
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    {listing.mileage.toLocaleString()} km
                  </span>
                )}
                {listing.fuelType && listing.fuelType !== 'N/A' && (
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    {listing.fuelType}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {listing.location.city}, {listing.location.country}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-accent">
                {listing.price ? (
                  <CurrencyDisplay amount={listing.price} currency={listing.currency || 'USD'} showDecimals={false} />
                ) : (
                  'Price on request'
                )}
              </div>
              <p className="text-xs text-muted-foreground">{listing.seller.name}</p>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="self-start p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              )}
            />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/listings/${listing.slug}`} className="block group">
      <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-border/80 transition-all duration-200 h-full flex flex-col">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Gauge className="w-12 h-12" />
            </div>
          )}
          {listing.isFeatured && (
            <Badge className="absolute top-2.5 left-2.5 bg-gradient-to-b from-accent-400 to-accent-600 text-white border border-accent-300/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.1)]">
              Featured
            </Badge>
          )}
          <span
            className={cn(
              'absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm',
              listing.condition === 'NEW'
                ? 'bg-emerald-500 text-white'
                : 'bg-white/90 text-foreground backdrop-blur-sm'
            )}
          >
            {listing.condition === 'NEW' ? 'New' : 'Used'}
          </span>
          <button
            onClick={handleFavoriteClick}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                favorited ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </button>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug">
            {listing.title}
          </h3>
          <div className="text-lg font-bold text-accent mt-2">
            {listing.price ? (
              <CurrencyDisplay amount={listing.price} currency={listing.currency || 'USD'} showDecimals={false} />
            ) : (
              'Price on request'
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {listing.year}
            </span>
            {listing.mileage != null && listing.mileage > 0 && (
              <>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  {listing.mileage.toLocaleString()} km
                </span>
              </>
            )}
            {listing.fuelType && listing.fuelType !== 'N/A' && (
              <>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  {listing.fuelType}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 mt-auto pt-3 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {listing.location.city}, {listing.location.country}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{listing.seller.name}</p>
        </div>
      </div>
    </Link>
  );
}
