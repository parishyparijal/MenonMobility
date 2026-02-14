'use client';

import { useState } from 'react';
import {
  Eye,
  Heart,
  MessageSquare,
  Phone,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dateRanges = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: '12m', label: '12 Months' },
];

const overviewStats = [
  { label: 'Total Views', value: '12,847', change: '+18%', up: true, icon: Eye },
  { label: 'Total Favorites', value: '342', change: '+12%', up: true, icon: Heart },
  { label: 'Messages Received', value: '56', change: '+8%', up: true, icon: MessageSquare },
  { label: 'Phone Reveals', value: '89', change: '-3%', up: false, icon: Phone },
];

// 30-day views chart data
const viewsData = [
  320, 280, 410, 380, 460, 520, 490, 350, 300, 420,
  510, 480, 390, 440, 530, 560, 470, 380, 420, 550,
  620, 580, 510, 460, 490, 530, 610, 580, 540, 500,
];

const favoritesData = [
  8, 5, 12, 9, 14, 18, 15, 7, 6, 11,
  16, 13, 10, 12, 17, 19, 14, 9, 11, 18,
  22, 20, 15, 13, 14, 17, 21, 19, 16, 14,
];

const topListings = [
  { title: 'Mercedes-Benz Actros 2545 LS 6x2', views: 2340, favorites: 67, contacts: 23 },
  { title: 'Volvo FH 500 4x2 Globetrotter XL', views: 1892, favorites: 45, contacts: 18 },
  { title: 'Scania R 450 Highline 4x2', views: 1654, favorites: 38, contacts: 15 },
  { title: 'DAF XF 480 Super Space Cab', views: 1247, favorites: 32, contacts: 12 },
  { title: 'MAN TGX 18.510 4x2 BLS', views: 1089, favorites: 28, contacts: 9 },
  { title: 'Iveco S-Way AS440S48', views: 876, favorites: 21, contacts: 7 },
  { title: 'Krone Profi Liner Curtainsider', views: 743, favorites: 19, contacts: 6 },
  { title: 'CAT 320 Hydraulic Excavator', views: 621, favorites: 15, contacts: 5 },
];

const contactsByType = [
  { type: 'Messages', count: 56, percentage: 38, color: 'bg-primary' },
  { type: 'Phone Reveals', count: 89, percentage: 42, color: 'bg-accent' },
  { type: 'WhatsApp', count: 34, percentage: 20, color: 'bg-green-500' },
];

export default function SellerAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  const maxViews = Math.max(...viewsData);
  const maxFavs = Math.max(...favoritesData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your listing performance</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-1">
          {dateRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => setDateRange(range.key)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                dateRange === range.key
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.up ? (
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span className={cn('text-xs', stat.up ? 'text-success' : 'text-destructive')}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs previous period</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Views Over Time</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-[3px] h-48">
              {viewsData.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-primary/70 rounded-t-sm transition-all hover:bg-primary"
                    style={{ height: `${(value / maxViews) * 100}%` }}
                    title={`Day ${i + 1}: ${value} views`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Favorites Over Time</CardTitle>
            <Heart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-[3px] h-48">
              {favoritesData.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-accent/70 rounded-t-sm transition-all hover:bg-accent"
                    style={{ height: `${(value / maxFavs) * 100}%` }}
                    title={`Day ${i + 1}: ${value} favorites`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Listings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Performing Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">#</th>
                    <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">Listing</th>
                    <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Views</th>
                    <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Favs</th>
                    <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Contacts</th>
                  </tr>
                </thead>
                <tbody>
                  {topListings.map((listing, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2.5 text-sm text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5 text-sm font-medium text-foreground truncate max-w-[200px] lg:max-w-[300px]">
                        {listing.title}
                      </td>
                      <td className="py-2.5 text-sm text-right text-foreground">
                        {listing.views.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-sm text-right text-foreground hidden sm:table-cell">
                        {listing.favorites}
                      </td>
                      <td className="py-2.5 text-sm text-right text-foreground hidden sm:table-cell">
                        {listing.contacts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Contact Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactsByType.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground">{item.type}</span>
                    <span className="text-sm font-medium text-foreground">{item.count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', item.color)}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Contacts</span>
                <span className="text-lg font-bold text-foreground">
                  {contactsByType.reduce((sum, c) => sum + c.count, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
