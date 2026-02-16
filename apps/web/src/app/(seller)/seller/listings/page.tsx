'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Eye,
  Heart,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatusBadge, type ListingStatus } from '@/components/common/status-badge';
import { Pagination } from '@/components/common/pagination';
import { cn } from '@/lib/utils';

interface SellerListing {
  id: string;
  slug: string;
  title: string;
  status: ListingStatus;
  price: number;
  currency: string;
  views: number;
  favorites: number;
  createdAt: string;
  image: string;
}

const tabDefinitions = [
  { key: 'all', label: 'All' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'PENDING_REVIEW', label: 'Pending' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'SOLD', label: 'Sold' },
  { key: 'EXPIRED', label: 'Expired' },
];

const dummyListings: SellerListing[] = [
  {
    id: '1',
    slug: 'mercedes-actros-2545',
    title: 'Mercedes-Benz Actros 2545 LS 6x2 StreamSpace',
    status: 'ACTIVE',
    price: 89500,
    currency: 'USD',
    views: 1247,
    favorites: 43,
    createdAt: '2024-01-15',
    image: '',
  },
  {
    id: '2',
    slug: 'volvo-fh-500',
    title: 'Volvo FH 500 4x2 Globetrotter XL',
    status: 'ACTIVE',
    price: 125000,
    currency: 'USD',
    views: 892,
    favorites: 28,
    createdAt: '2024-01-12',
    image: '',
  },
  {
    id: '3',
    slug: 'daf-xf-480',
    title: 'DAF XF 480 FT Space Cab',
    status: 'PENDING_REVIEW',
    price: 92000,
    currency: 'USD',
    views: 0,
    favorites: 0,
    createdAt: '2024-01-18',
    image: '',
  },
  {
    id: '4',
    slug: 'scania-r450',
    title: 'Scania R 450 A4x2NA Highline',
    status: 'DRAFT',
    price: 78900,
    currency: 'USD',
    views: 0,
    favorites: 0,
    createdAt: '2024-01-19',
    image: '',
  },
  {
    id: '5',
    slug: 'man-tgx-18-510',
    title: 'MAN TGX 18.510 4x2 BLS',
    status: 'SOLD',
    price: 115000,
    currency: 'USD',
    views: 2340,
    favorites: 67,
    createdAt: '2023-12-05',
    image: '',
  },
  {
    id: '6',
    slug: 'iveco-s-way',
    title: 'Iveco S-Way AS440S48T/P',
    status: 'ACTIVE',
    price: 98000,
    currency: 'USD',
    views: 456,
    favorites: 12,
    createdAt: '2024-01-10',
    image: '',
  },
  {
    id: '7',
    slug: 'renault-t480',
    title: 'Renault T480 High Sleeper Cab',
    status: 'EXPIRED',
    price: 76500,
    currency: 'USD',
    views: 1120,
    favorites: 34,
    createdAt: '2023-10-01',
    image: '',
  },
];

export default function SellerListingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const tabs = tabDefinitions.map((tab) => ({
    ...tab,
    count: tab.key === 'all'
      ? dummyListings.length
      : dummyListings.filter((l) => l.status === tab.key).length,
  }));

  const filteredListings = dummyListings.filter((listing) => {
    if (activeTab !== 'all' && listing.status !== activeTab) return false;
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your vehicle listings</p>
        </div>
        <Button variant="accent" asChild>
          <Link href="/seller/listings/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Link>
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-white text-foreground hover:bg-muted border border-border'
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Favorites
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="py-3 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground text-xs">
                          IMG
                        </div>
                        <Link
                          href={`/listings/${listing.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1 max-w-[250px]"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={listing.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-foreground">
                        €{listing.price.toLocaleString('de-DE')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Eye className="w-3.5 h-3.5" />
                        {listing.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Heart className="w-3.5 h-3.5" />
                        {listing.favorites}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(listing.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === listing.id ? null : listing.id)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenu === listing.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border z-10 py-1 min-w-[160px]">
                            <Link
                              href={`/seller/listings/${listing.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            {listing.status === 'ACTIVE' && (
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Sold
                              </button>
                            )}
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredListings.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No listings found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination - only show when more than 100 listings */}
      {filteredListings.length > 100 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredListings.length / 100)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
