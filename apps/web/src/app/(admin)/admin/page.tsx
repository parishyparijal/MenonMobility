'use client';

import Link from 'next/link';
import {
  List,
  Clock,
  Users,
  Building,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';

const statsCards = [
  {
    title: 'Total Listings',
    value: '4,285',
    change: '+124',
    changeType: 'up' as const,
    icon: List,
    color: 'bg-primary-50 text-primary',
  },
  {
    title: 'Pending Review',
    value: '23',
    change: '+5',
    changeType: 'up' as const,
    icon: Clock,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    title: 'Total Users',
    value: '12,847',
    change: '+342',
    changeType: 'up' as const,
    icon: Users,
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Total Sellers',
    value: '1,234',
    change: '+28',
    changeType: 'up' as const,
    icon: Building,
    color: 'bg-accent/10 text-accent',
  },
  {
    title: 'Revenue (MTD)',
    value: 'EUR 45,670',
    change: '+12%',
    changeType: 'up' as const,
    icon: DollarSign,
    color: 'bg-primary-50 text-primary',
  },
];

const chartDaysListings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const newListingsData = [45, 38, 62, 51, 73, 28, 19];
const newUsersData = [120, 95, 140, 110, 155, 85, 65];
const maxListings = Math.max(...newListingsData);
const maxUsers = Math.max(...newUsersData);

const pendingListings = [
  {
    id: '1',
    title: 'Mercedes-Benz Actros 1845 LS 4x2',
    seller: 'EuroTruck GmbH',
    price: 72500,
    submittedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Volvo FH16 750 6x4',
    seller: 'Nordic Heavy AB',
    price: 185000,
    submittedAt: '4 hours ago',
  },
  {
    id: '3',
    title: 'Caterpillar 336F L Excavator',
    seller: 'BuildEquip BV',
    price: 210000,
    submittedAt: '6 hours ago',
  },
  {
    id: '4',
    title: 'Scania G 410 A6x2/4NA',
    seller: 'FleetPro NV',
    price: 68900,
    submittedAt: '8 hours ago',
  },
  {
    id: '5',
    title: 'DAF CF 450 FT Space Cab',
    seller: 'DutchFleet BV',
    price: 81000,
    submittedAt: '12 hours ago',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your marketplace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-success" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-[10px] text-success">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-800 to-primary-400 rounded-t-md transition-all"
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
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-700 to-green-400 rounded-t-md transition-all"
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
          <div className="space-y-3">
            {pendingListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs shrink-0">
                    IMG
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.seller} &middot; EUR {listing.price.toLocaleString()} &middot; {listing.submittedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="inline-flex items-center h-9 px-3 text-xs font-medium rounded-lg text-white bg-gradient-to-b from-green-400 to-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.2)] border border-green-300/30 hover:from-green-300 hover:to-green-500 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Approve
                  </button>
                  <button className="inline-flex items-center h-9 px-3 text-xs font-medium rounded-lg text-white bg-gradient-to-b from-red-400 to-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.2)] border border-red-300/30 hover:from-red-300 hover:to-red-500 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all">
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
