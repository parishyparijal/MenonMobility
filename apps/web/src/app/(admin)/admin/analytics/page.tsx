'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  List,
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const timeRanges = ['7 Days', '30 Days', '90 Days', '12 Months'] as const;
type TimeRange = typeof timeRanges[number];

const overviewStats = [
  { label: 'Total Page Views', value: '1,248,500', change: '+18.2%', up: true, icon: Eye },
  { label: 'Unique Visitors', value: '342,800', change: '+12.5%', up: true, icon: Users },
  { label: 'New Listings', value: '1,847', change: '+8.3%', up: true, icon: List },
  { label: 'New Users', value: '4,562', change: '+15.1%', up: true, icon: Users },
  { label: 'Messages Sent', value: '8,934', change: '+22.4%', up: true, icon: MessageSquare },
  { label: 'Favorites Added', value: '12,456', change: '+9.7%', up: true, icon: Heart },
  { label: 'Revenue', value: 'EUR 145,670', change: '+28.3%', up: true, icon: DollarSign },
  { label: 'Bounce Rate', value: '32.4%', change: '-5.2%', up: false, icon: TrendingDown },
];

const dailyViews = [
  { day: 'Mon', views: 42500 },
  { day: 'Tue', views: 38900 },
  { day: 'Wed', views: 51200 },
  { day: 'Thu', views: 47800 },
  { day: 'Fri', views: 56300 },
  { day: 'Sat', views: 34200 },
  { day: 'Sun', views: 28100 },
];
const maxViews = Math.max(...dailyViews.map((d) => d.views));

const dailyListings = [
  { day: 'Mon', count: 45 },
  { day: 'Tue', count: 38 },
  { day: 'Wed', count: 62 },
  { day: 'Thu', count: 51 },
  { day: 'Fri', count: 73 },
  { day: 'Sat', count: 28 },
  { day: 'Sun', count: 19 },
];
const maxListings = Math.max(...dailyListings.map((d) => d.count));

const topCategories = [
  { name: 'Trucks', listings: 2456, views: 456000, percentage: 38 },
  { name: 'Trailers', listings: 1120, views: 234000, percentage: 22 },
  { name: 'Construction', listings: 890, views: 178000, percentage: 15 },
  { name: 'Vans', listings: 654, views: 134000, percentage: 12 },
  { name: 'Parts', listings: 567, views: 98000, percentage: 8 },
  { name: 'Others', listings: 530, views: 67000, percentage: 5 },
];

const topCountries = [
  { name: 'Germany', flag: 'DE', users: 4523, percentage: 28 },
  { name: 'Netherlands', flag: 'NL', users: 3456, percentage: 21 },
  { name: 'Belgium', flag: 'BE', users: 2189, percentage: 13 },
  { name: 'Poland', flag: 'PL', users: 1876, percentage: 11 },
  { name: 'France', flag: 'FR', users: 1543, percentage: 9 },
  { name: 'United Kingdom', flag: 'GB', users: 1234, percentage: 8 },
  { name: 'Italy', flag: 'IT', users: 987, percentage: 6 },
  { name: 'Spain', flag: 'ES', users: 654, percentage: 4 },
];

const recentActivity = [
  { type: 'listing', text: 'New listing: Mercedes-Benz Actros 2545 LS', time: '2 min ago' },
  { type: 'user', text: 'New seller registration: FleetMax BV', time: '5 min ago' },
  { type: 'review', text: 'New 5-star review for TransEuropa BV', time: '12 min ago' },
  { type: 'message', text: '15 new messages in the last hour', time: '15 min ago' },
  { type: 'payment', text: 'Subscription payment received: EUR 49.00', time: '23 min ago' },
  { type: 'listing', text: 'Listing sold: Volvo FH 500 Globetrotter XL', time: '45 min ago' },
  { type: 'user', text: 'New buyer registration from Germany', time: '1 hour ago' },
  { type: 'listing', text: 'Listing expired: DAF CF 450 FT Space Cab', time: '2 hours ago' },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30 Days');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Marketplace performance overview</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                timeRange === range ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <div className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.up ? 'text-success' : 'text-accent'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Page Views / Day</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {dailyViews.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-muted rounded-t-md relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-md transition-all"
                      style={{ height: `${(d.views / maxViews) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  <span className="text-[10px] font-medium">{(d.views / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">New Listings / Day</CardTitle>
            <List className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {dailyListings.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-muted rounded-t-md relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-accent/80 rounded-t-md transition-all"
                      style={{ height: `${(d.count / maxListings) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  <span className="text-[10px] font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category & Country breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.listings.toLocaleString()} listings &middot; {(cat.views / 1000).toFixed(0)}k views</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCountries.map((country) => (
                <div key={country.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{country.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{country.users.toLocaleString()} users ({country.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${country.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'listing' ? 'bg-primary' :
                  activity.type === 'user' ? 'bg-success' :
                  activity.type === 'review' ? 'bg-yellow-500' :
                  activity.type === 'payment' ? 'bg-accent' :
                  'bg-muted-foreground'
                }`} />
                <span className="text-sm text-foreground flex-1">{activity.text}</span>
                <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
