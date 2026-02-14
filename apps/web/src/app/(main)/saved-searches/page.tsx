'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';

interface SavedSearch {
  id: string;
  name: string;
  filters: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    country?: string;
  };
  frequency: 'never' | 'daily' | 'weekly';
  matchCount: number;
  newMatches: number;
  createdAt: string;
}

const dummySavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Mercedes Actros under 100k',
    filters: { brand: 'Mercedes-Benz', category: 'trucks', maxPrice: 100000 },
    frequency: 'daily',
    matchCount: 234,
    newMatches: 5,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'New Volvo Trucks',
    filters: { brand: 'Volvo', condition: 'NEW', category: 'trucks' },
    frequency: 'weekly',
    matchCount: 45,
    newMatches: 2,
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Construction Equipment Germany',
    filters: { category: 'construction', country: 'Germany' },
    frequency: 'never',
    matchCount: 89,
    newMatches: 0,
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Trailers under 30k',
    filters: { category: 'trailers', maxPrice: 30000 },
    frequency: 'daily',
    matchCount: 156,
    newMatches: 8,
    createdAt: '2024-01-08',
  },
];

function buildSearchUrl(filters: SavedSearch['filters']): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.minPrice) params.set('priceMin', String(filters.minPrice));
  if (filters.maxPrice) params.set('priceMax', String(filters.maxPrice));
  if (filters.condition) params.set('condition', filters.condition.toLowerCase());
  if (filters.country) params.set('country', filters.country.toLowerCase());
  return `/search?${params.toString()}`;
}

function filterSummary(filters: SavedSearch['filters']): string {
  const parts: string[] = [];
  if (filters.category) parts.push(filters.category);
  if (filters.brand) parts.push(filters.brand);
  if (filters.condition) parts.push(filters.condition);
  if (filters.minPrice || filters.maxPrice) {
    parts.push(`${filters.minPrice ? `${filters.minPrice.toLocaleString()}` : '0'} - ${filters.maxPrice ? `${filters.maxPrice.toLocaleString()}` : '...'}`);
  }
  if (filters.country) parts.push(filters.country);
  return parts.join(' / ');
}

export default function SavedSearchesPage() {
  const router = useRouter();
  const [searches, setSearches] = useState(dummySavedSearches);

  const handleDelete = (id: string) => {
    setSearches(searches.filter((s) => s.id !== id));
  };

  const handleFrequencyChange = (id: string, frequency: SavedSearch['frequency']) => {
    setSearches(searches.map((s) => (s.id === id ? { ...s, frequency } : s)));
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Saved Searches</h1>
              <p className="text-muted-foreground text-sm">
                {searches.length} saved {searches.length === 1 ? 'search' : 'searches'}
              </p>
            </div>
          </div>
          <Button variant="accent" asChild>
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Link>
          </Button>
        </div>

        {searches.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No saved searches"
            description="Save your favorite searches to get notified when new matching listings appear."
            action={{
              label: 'Start Searching',
              onClick: () => router.push('/search'),
            }}
          />
        ) : (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.id}
                className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">{search.name}</h3>
                    {search.newMatches > 0 && (
                      <Badge className="bg-accent text-white border-0 text-[10px]">
                        {search.newMatches} new
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{filterSummary(search.filters)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {search.matchCount.toLocaleString()} matching listings
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Frequency selector */}
                  <select
                    value={search.frequency}
                    onChange={(e) => handleFrequencyChange(search.id, e.target.value as SavedSearch['frequency'])}
                    className="h-8 px-2 rounded-lg border border-border bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="never">No alerts</option>
                    <option value="daily">Daily alerts</option>
                    <option value="weekly">Weekly alerts</option>
                  </select>

                  <Button variant="ghost" size="sm" asChild>
                    <Link href={buildSearchUrl(search.filters)}>
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      View
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => handleDelete(search.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
