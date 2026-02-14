'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge, type ListingStatus } from '@/components/common/status-badge';
import { Pagination } from '@/components/common/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getImagesForListing } from '@/lib/images';

interface AdminListing {
  id: string;
  slug: string;
  title: string;
  seller: string;
  status: ListingStatus;
  price: number;
  currency: string;
  views: number;
  createdAt: string;
  thumbnail?: string;
}

const tabs = [
  { key: 'all', label: 'All', count: 4285 },
  { key: 'PENDING_REVIEW', label: 'Pending', count: 23 },
  { key: 'ACTIVE', label: 'Active', count: 3842 },
  { key: 'DRAFT', label: 'Draft', count: 156 },
  { key: 'SOLD', label: 'Sold', count: 198 },
  { key: 'REJECTED', label: 'Rejected', count: 42 },
  { key: 'EXPIRED', label: 'Expired', count: 24 },
];

const dummyListings: AdminListing[] = [
  { id: '1', slug: 'mercedes-actros-2545', title: 'Mercedes-Benz Actros 2545 LS 6x2', seller: 'TransEuropa BV', status: 'PENDING_REVIEW', price: 89500, currency: 'EUR', views: 0, createdAt: '2024-01-18', thumbnail: getImagesForListing('Mercedes-Benz Actros 2545')[0] },
  { id: '2', slug: 'volvo-fh-500', title: 'Volvo FH 500 4x2 Globetrotter', seller: 'Nordic Trucks GmbH', status: 'PENDING_REVIEW', price: 125000, currency: 'EUR', views: 0, createdAt: '2024-01-18', thumbnail: getImagesForListing('Volvo FH 500')[0] },
  { id: '3', slug: 'caterpillar-336f', title: 'Caterpillar 336F L Excavator', seller: 'BuildEquip BV', status: 'ACTIVE', price: 210000, currency: 'EUR', views: 3456, createdAt: '2024-01-10', thumbnail: getImagesForListing('Caterpillar 336F Excavator')[0] },
  { id: '4', slug: 'scania-g-410', title: 'Scania G 410 A6x2/4NA', seller: 'FleetPro NV', status: 'ACTIVE', price: 68900, currency: 'EUR', views: 1234, createdAt: '2024-01-08', thumbnail: getImagesForListing('Scania G 410')[0] },
  { id: '5', slug: 'daf-cf-450', title: 'DAF CF 450 FT Space Cab', seller: 'DutchFleet BV', status: 'REJECTED', price: 81000, currency: 'EUR', views: 56, createdAt: '2024-01-05', thumbnail: getImagesForListing('DAF CF 450')[0] },
  { id: '6', slug: 'man-tgx-26', title: 'MAN TGX 26.510 6x2-4 BL', seller: 'BavariaTruck AG', status: 'ACTIVE', price: 142000, currency: 'EUR', views: 987, createdAt: '2024-01-03', thumbnail: getImagesForListing('MAN TGX 26.510')[0] },
  { id: '7', slug: 'iveco-s-way', title: 'Iveco S-Way AS440S48T/P', seller: 'ItalTruck SRL', status: 'DRAFT', price: 98000, currency: 'EUR', views: 0, createdAt: '2024-01-15', thumbnail: getImagesForListing('Iveco S-Way')[0] },
  { id: '8', slug: 'renault-t480', title: 'Renault T480 High Sleeper Cab', seller: 'FleetFrance SA', status: 'SOLD', price: 76500, currency: 'EUR', views: 2100, createdAt: '2023-12-20', thumbnail: getImagesForListing('Renault T480')[0] },
];

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredListings = dummyListings.filter((listing) => {
    if (activeTab !== 'all' && listing.status !== activeTab) return false;
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && !listing.seller.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    // In real app, call API
    setRejectModalOpen(false);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Listing Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage all listings</p>
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
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              activeTab === tab.key
                ? 'bg-red-500 text-white'
                : 'bg-white text-foreground hover:bg-muted border border-border'
            )}
          >
            {tab.label}
            <span className="ml-1 opacity-70">({tab.count.toLocaleString()})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title or seller..."
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
                    Seller
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
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded bg-muted overflow-hidden shrink-0">
                          {listing.thumbnail ? (
                            <img src={listing.thumbnail} alt={listing.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">IMG</div>
                          )}
                        </div>
                        <Link
                          href={`/listings/${listing.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1 max-w-[220px]"
                          target="_blank"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">{listing.seller}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={listing.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-foreground">
                        EUR {listing.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{listing.views.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(listing.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        {listing.status === 'PENDING_REVIEW' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-success hover:text-success h-8 px-2"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive h-8 px-2"
                              title="Reject"
                              onClick={() => handleReject(listing.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 px-2" title="View" asChild>
                          <Link href={`/listings/${listing.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive h-8 px-2"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

      <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this listing. The seller will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            id="reject-reason"
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              Reject Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
