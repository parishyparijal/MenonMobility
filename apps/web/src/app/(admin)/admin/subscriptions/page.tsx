'use client';

import { useState } from 'react';
import {
  CreditCard,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  Pencil,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  maxListings: number;
  maxImages: number;
  subscriberCount: number;
  revenue: number;
  isActive: boolean;
}

const dummyPlans: SubscriptionPlan[] = [
  { id: '1', name: 'Free', slug: 'free', priceMonthly: 0, priceYearly: 0, maxListings: 3, maxImages: 5, subscriberCount: 8450, revenue: 0, isActive: true },
  { id: '2', name: 'Basic', slug: 'basic', priceMonthly: 29, priceYearly: 290, maxListings: 15, maxImages: 15, subscriberCount: 1234, revenue: 35786, isActive: true },
  { id: '3', name: 'Pro', slug: 'pro', priceMonthly: 79, priceYearly: 790, maxListings: 100, maxImages: 30, subscriberCount: 456, revenue: 36024, isActive: true },
  { id: '4', name: 'Enterprise', slug: 'enterprise', priceMonthly: 199, priceYearly: 1990, maxListings: 9999, maxImages: 50, subscriberCount: 89, revenue: 17711, isActive: true },
];

interface RecentSubscription {
  id: string;
  userName: string;
  email: string;
  planName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  amount: number;
  startDate: string;
  endDate: string;
}

const dummySubscriptions: RecentSubscription[] = [
  { id: '1', userName: 'TransEuropa BV', email: 'info@transeuropa.nl', planName: 'Pro', status: 'ACTIVE', amount: 79, startDate: '2024-01-01', endDate: '2024-02-01' },
  { id: '2', userName: 'Nordic Trucks GmbH', email: 'sales@nordictrucks.de', planName: 'Enterprise', status: 'ACTIVE', amount: 199, startDate: '2024-01-05', endDate: '2024-02-05' },
  { id: '3', userName: 'FleetPro NV', email: 'admin@fleetpro.be', planName: 'Basic', status: 'ACTIVE', amount: 29, startDate: '2024-01-10', endDate: '2024-02-10' },
  { id: '4', userName: 'BavariaTruck AG', email: 'contact@bavariatruck.de', planName: 'Pro', status: 'ACTIVE', amount: 790, startDate: '2024-01-01', endDate: '2025-01-01' },
  { id: '5', userName: 'DutchFleet BV', email: 'info@dutchfleet.nl', planName: 'Basic', status: 'CANCELLED', amount: 29, startDate: '2023-12-01', endDate: '2024-01-01' },
  { id: '6', userName: 'EuroBuild Sp.', email: 'office@eurobuild.pl', planName: 'Pro', status: 'EXPIRED', amount: 79, startDate: '2023-11-15', endDate: '2023-12-15' },
];

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-success/10 text-success',
  CANCELLED: 'bg-muted text-muted-foreground',
  EXPIRED: 'bg-destructive/10 text-destructive',
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState(dummyPlans);
  const [searchQuery, setSearchQuery] = useState('');

  const totalRevenue = plans.reduce((s, p) => s + p.revenue, 0);
  const totalSubscribers = plans.reduce((s, p) => s + p.subscriberCount, 0);
  const paidSubscribers = plans.filter((p) => p.priceMonthly > 0).reduce((s, p) => s + p.subscriberCount, 0);

  const filteredSubscriptions = dummySubscriptions.filter((s) =>
    !searchQuery || s.userName.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlan = (id: string) => {
    setPlans(plans.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage plans and subscriber billing</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Monthly Revenue</span>
            </div>
            <p className="text-xl font-bold text-foreground">EUR {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Users</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totalSubscribers.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Paid Subscribers</span>
            </div>
            <p className="text-xl font-bold text-foreground">{paidSubscribers.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Conversion Rate</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totalSubscribers > 0 ? ((paidSubscribers / totalSubscribers) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Monthly</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Yearly</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Listings</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Images</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Subscribers</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Revenue</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium text-foreground">{plan.name}</td>
                  <td className="py-3 px-4 text-right">{plan.priceMonthly === 0 ? 'Free' : `EUR ${plan.priceMonthly}`}</td>
                  <td className="py-3 px-4 text-right">{plan.priceYearly === 0 ? 'Free' : `EUR ${plan.priceYearly}`}</td>
                  <td className="py-3 px-4 text-right">{plan.maxListings >= 9999 ? 'Unlimited' : plan.maxListings}</td>
                  <td className="py-3 px-4 text-right">{plan.maxImages}</td>
                  <td className="py-3 px-4 text-right font-medium">{plan.subscriberCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">EUR {plan.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => togglePlan(plan.id)}>
                      {plan.isActive ? (
                        <ToggleRight className="w-6 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Pencil className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Subscriptions</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-9 pr-3 rounded-lg border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Subscriber</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Period</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{sub.userName}</p>
                    <p className="text-xs text-muted-foreground">{sub.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">{sub.planName}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">EUR {sub.amount}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={`${statusColors[sub.status]} border-0 text-[10px]`}>{sub.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-muted-foreground">{sub.startDate} — {sub.endDate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
