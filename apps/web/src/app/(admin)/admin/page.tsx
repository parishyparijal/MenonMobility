'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  List,
  Clock,
  Users,
  Building,
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  pendingReview: number;
  totalUsers: number;
  totalSellers: number;
  newUsersThisMonth: number;
  newListingsThisMonth: number;
}

interface PendingListing {
  id: string;
  title: string;
  slug: string;
  price: number;
  priceCurrency: string;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  images: {
    id: string;
    thumbnailUrl: string;
    originalUrl: string;
  }[];
}

const defaultStats: DashboardStats = {
  totalListings: 0,
  activeListings: 0,
  pendingReview: 0,
  totalUsers: 0,
  totalSellers: 0,
  newUsersThisMonth: 0,
  newListingsThisMonth: 0,
};

const chartDaysListings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const newListingsData = [45, 38, 62, 51, 73, 28, 19];
const newUsersData = [120, 95, 140, 110, 155, 85, 65];
const maxListings = Math.max(...newListingsData);
const maxUsers = Math.max(...newUsersData);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dashRes, listingsRes] = await Promise.all([
        api.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard'),
        api.get<{ success: boolean; data: PendingListing[]; pagination: any }>(
          '/admin/listings?status=PENDING_REVIEW&limit=5'
        ),
      ]);
      setStats(dashRes.data);
      setPendingListings(listingsRes.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/listings/${id}/approve`);
      toast.success('Listing approved');
      fetchDashboard();
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
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject listing');
    } finally {
      setActionLoading(null);
    }
  };

  const statsCards = [
    {
      title: 'Total Listings',
      value: stats.totalListings.toLocaleString(),
      change: `+${stats.newListingsThisMonth}`,
      icon: List,
      color: 'bg-primary-50 text-primary',
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview.toLocaleString(),
      change: '',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.newUsersThisMonth}`,
      icon: Users,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Sellers',
      value: stats.totalSellers.toLocaleString(),
      change: '',
      icon: Building,
      color: 'bg-accent/10 text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your marketplace</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="w-3 h-3 text-success" />
                        <span className="text-[10px] text-success">{stat.change} this month</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Listings Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">New Listings / Day</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {chartDaysListings.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-muted rounded-t-md relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-md transition-all"
                      style={{ height: `${(newListingsData[i] / maxListings) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                  <span className="text-[10px] font-medium">{newListingsData[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Users Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">New Users / Day</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {chartDaysListings.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-muted rounded-t-md relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-green-500/80 rounded-t-md transition-all"
                      style={{ height: `${(newUsersData[i] / maxUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                  <span className="text-[10px] font-medium">{newUsersData[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Listings Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pending Listings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/listings?status=PENDING_REVIEW">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : pendingListings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-sm">No pending listings to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingListings.map((listing) => {
                const thumbnail = listing.images?.[0]?.thumbnailUrl || listing.images?.[0]?.originalUrl;
                return (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-9 rounded-lg bg-muted overflow-hidden flex items-center justify-center text-muted-foreground text-xs shrink-0">
                        {thumbnail ? (
                          <img src={thumbnail} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          'IMG'
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {listing.seller?.name || '—'} &middot; {listing.priceCurrency || 'EUR'}{' '}
                          {listing.price?.toLocaleString()} &middot;{' '}
                          {new Date(listing.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-success border-success/30 hover:bg-success/10"
                        onClick={() => handleApprove(listing.id)}
                        disabled={actionLoading === listing.id}
                      >
                        {actionLoading === listing.id ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleReject(listing.id)}
                        disabled={actionLoading === listing.id}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}
