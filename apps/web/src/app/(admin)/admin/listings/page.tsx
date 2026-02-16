'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Loader2,
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
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface AdminListing {
  id: string;
  title: string;
  slug: string;
  price: number;
  priceCurrency: string;
  condition: string;
  status: ListingStatus;
  year: number;
  mileageKm: number;
  viewCount: number;
  favoriteCount: number;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: {
    id: string;
    thumbnailUrl: string;
    originalUrl: string;
  }[];
}

interface ListingsResponse {
  success: boolean;
  data: AdminListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TabInfo {
  key: string;
  label: string;
  count: number;
}

const defaultTabs: TabInfo[] = [
  { key: 'all', label: 'All', count: 0 },
  { key: 'PENDING_REVIEW', label: 'Pending', count: 0 },
  { key: 'ACTIVE', label: 'Active', count: 0 },
  { key: 'DRAFT', label: 'Draft', count: 0 },
  { key: 'SOLD', label: 'Sold', count: 0 },
  { key: 'REJECTED', label: 'Rejected', count: 0 },
  { key: 'EXPIRED', label: 'Expired', count: 0 },
];

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [listings, setListings] = useState<AdminListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [tabs, setTabs] = useState<TabInfo[]>(defaultTabs);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusParam = activeTab !== 'all' ? `&status=${activeTab}` : '';
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const res = await api.get<ListingsResponse>(
        `/admin/listings?page=${currentPage}&limit=20${statusParam}${searchParam}`
      );
      setListings(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load listings');
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage, searchQuery]);

  const fetchTabCounts = useCallback(async () => {
    try {
      const statuses = ['PENDING_REVIEW', 'ACTIVE', 'DRAFT', 'SOLD', 'REJECTED', 'EXPIRED'];
      const results = await Promise.all([
        api.get<ListingsResponse>('/admin/listings?page=1&limit=1'),
        ...statuses.map((s) => api.get<ListingsResponse>(`/admin/listings?page=1&limit=1&status=${s}`)),
      ]);

      setTabs([
        { key: 'all', label: 'All', count: results[0].pagination.total },
        { key: 'PENDING_REVIEW', label: 'Pending', count: results[1].pagination.total },
        { key: 'ACTIVE', label: 'Active', count: results[2].pagination.total },
        { key: 'DRAFT', label: 'Draft', count: results[3].pagination.total },
        { key: 'SOLD', label: 'Sold', count: results[4].pagination.total },
        { key: 'REJECTED', label: 'Rejected', count: results[5].pagination.total },
        { key: 'EXPIRED', label: 'Expired', count: results[6].pagination.total },
      ]);
    } catch {
      // Keep default counts on error
    }
  }, []);

  useEffect(() => {
    fetchTabCounts();
  }, [fetchTabCounts]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/listings/${id}/approve`);
      toast.success('Listing approved');
      fetchListings();
      fetchTabCounts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve listing');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingId) return;
    setActionLoading(rejectingId);
    try {
      await api.patch(`/admin/listings/${rejectingId}/reject`, {
        rejectedReason: rejectReason,
      });
      toast.success('Listing rejected');
      setRejectModalOpen(false);
      setRejectingId(null);
      setRejectReason('');
      fetchListings();
      fetchTabCounts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject listing');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setActionLoading(deletingId);
    try {
      await api.del(`/admin/listings/${deletingId}`);
      toast.success('Listing permanently deleted');
      setDeleteModalOpen(false);
      setDeletingId(null);
      fetchListings();
      fetchTabCounts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete listing');
    } finally {
      setActionLoading(null);
    }
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
                ? 'bg-accent text-white'
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
          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading listings...</span>
            </div>
          ) : (
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
                  {listings.map((listing) => {
                    const thumbnail = listing.images?.[0]?.thumbnailUrl || listing.images?.[0]?.originalUrl;
                    return (
                      <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded bg-muted overflow-hidden shrink-0">
                              {thumbnail ? (
                                <img src={thumbnail} alt={listing.title} className="w-full h-full object-cover" />
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
                          <span className="text-sm text-foreground">{listing.seller?.name || '—'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={listing.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-medium text-foreground">
                            {listing.priceCurrency || 'USD'} {listing.price?.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{(listing.viewCount || 0).toLocaleString()}</span>
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
                                  onClick={() => handleApprove(listing.id)}
                                  disabled={actionLoading === listing.id}
                                >
                                  {actionLoading === listing.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive h-8 px-2"
                                  title="Reject"
                                  onClick={() => handleReject(listing.id)}
                                  disabled={actionLoading === listing.id}
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
                              onClick={() => handleDeleteClick(listing.id)}
                              disabled={actionLoading === listing.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && listings.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No listings found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

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
              disabled={!rejectReason.trim() || rejectReason.trim().length < 5 || actionLoading !== null}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Listing'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={actionLoading !== null}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Permanently'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
