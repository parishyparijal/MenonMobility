'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  List,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';

const statsCards = [
  {
    title: 'Active Listings',
    value: '24',
    change: '+3',
    changeType: 'up' as const,
    icon: List,
    color: 'bg-primary-50 text-primary',
  },
  {
    title: 'Total Views',
    value: '12,847',
    change: '+18%',
    changeType: 'up' as const,
    icon: Eye,
    color: 'bg-accent/10 text-accent',
  },
  {
    title: 'Total Favorites',
    value: '342',
    change: '+12%',
    changeType: 'up' as const,
    icon: Heart,
    color: 'bg-red-50 text-red-500',
  },
  {
    title: 'Total Messages',
    value: '56',
    change: '-5%',
    changeType: 'down' as const,
    icon: MessageSquare,
    color: 'bg-green-50 text-green-600',
  },
];

const recentMessages = [
  {
    id: '1',
    sender: 'Klaus Mueller',
    listing: 'Mercedes-Benz Actros 2545',
    message: 'Is this truck still available? I am interested in scheduling a viewing.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    sender: 'Pierre Dupont',
    listing: 'Volvo FH 500 Globetrotter',
    message: 'What is the best price you can offer for this vehicle?',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: '3',
    sender: 'Anna Kowalski',
    listing: 'DAF XF 480 Space Cab',
    message: 'Thank you for the information. I will get back to you next week.',
    time: '1 day ago',
    unread: false,
  },
  {
    id: '4',
    sender: 'Marco Rossi',
    listing: 'Scania R 450 Highline',
    message: 'Can you arrange delivery to Milan, Italy?',
    time: '2 days ago',
    unread: false,
  },
];

const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const chartViews = [420, 380, 510, 460, 620, 340, 280];
const maxViews = Math.max(...chartViews);

export default function SellerDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name || 'Seller'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your listings
          </p>
        </div>
        <Button variant="accent" asChild>
          <Link href="/seller/listings/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span
                      className={
                        stat.changeType === 'up' ? 'text-xs text-success' : 'text-xs text-destructive'
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Views This Week</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {chartDays.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-t-md relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-md transition-all"
                      style={{ height: `${(chartViews[i] / maxViews) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day}</span>
                  <span className="text-xs font-medium text-foreground">{chartViews[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Messages</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/messages">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {msg.sender.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {msg.sender}
                      </span>
                      {msg.unread && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.listing}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.message}</p>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent" asChild>
              <Link href="/seller/listings/new">
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/seller/listings">Manage Listings</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/seller/messages">View Messages</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/seller/profile">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
