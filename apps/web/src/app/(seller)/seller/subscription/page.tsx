'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Check,
  ArrowRight,
  Shield,
  Crown,
  Zap,
  AlertCircle,
  Calendar,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  maxListings: number;
  maxImages: number;
  features: string[];
  icon: React.ElementType;
}

const plans: Plan[] = [
  {
    id: 'p1', name: 'Basic', slug: 'basic', priceMonthly: 29, priceYearly: 290, maxListings: 15, maxImages: 15,
    features: ['15 active listings', '15 photos per listing', '60-day listing duration', '1 featured listing/month', 'Company profile page', 'Email support'],
    icon: Package,
  },
  {
    id: 'p2', name: 'Pro', slug: 'pro', priceMonthly: 79, priceYearly: 790, maxListings: 100, maxImages: 30,
    features: ['100 active listings', '30 photos per listing', '90-day listing duration', '5 featured listings/month', 'Priority placement', 'Social media promotion', 'API access'],
    icon: Zap,
  },
  {
    id: 'p3', name: 'Enterprise', slug: 'enterprise', priceMonthly: 199, priceYearly: 1990, maxListings: 9999, maxImages: 50,
    features: ['Unlimited listings', '50 photos per listing', '180-day listing duration', '20 featured listings/month', 'Priority placement', 'Dedicated account manager', 'API access', 'Custom branding'],
    icon: Crown,
  },
];

// Simulated current subscription
const currentSubscription = {
  planId: 'p2',
  planName: 'Pro',
  status: 'ACTIVE' as const,
  billingCycle: 'MONTHLY' as const,
  periodStart: '2024-01-01',
  periodEnd: '2024-02-01',
  price: 79,
  usage: {
    activeListings: 24,
    maxListings: 100,
    featuredUsed: 3,
    featuredMax: 5,
  },
};

const paymentHistory = [
  { id: '1', date: '2024-01-01', amount: 79, status: 'paid', description: 'Pro Plan - January 2024' },
  { id: '2', date: '2023-12-01', amount: 79, status: 'paid', description: 'Pro Plan - December 2023' },
  { id: '3', date: '2023-11-01', amount: 79, status: 'paid', description: 'Pro Plan - November 2023' },
  { id: '4', date: '2023-10-01', amount: 29, status: 'paid', description: 'Basic Plan - October 2023' },
  { id: '5', date: '2023-09-01', amount: 29, status: 'paid', description: 'Basic Plan - September 2023' },
];

export default function SellerSubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [showPlans, setShowPlans] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan and billing</p>
      </div>

      {/* Current Plan */}
      <Card className="border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Current Plan: {currentSubscription.planName}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentSubscription.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'} billing
              </p>
            </div>
          </div>
          <Badge className="bg-success/10 text-success border-0">{currentSubscription.status}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Monthly Cost</p>
              <p className="text-lg font-bold text-foreground">EUR {currentSubscription.price}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Active Listings</p>
              <p className="text-lg font-bold text-foreground">
                {currentSubscription.usage.activeListings}/{currentSubscription.usage.maxListings}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Featured Used</p>
              <p className="text-lg font-bold text-foreground">
                {currentSubscription.usage.featuredUsed}/{currentSubscription.usage.featuredMax}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Renews On</p>
              <p className="text-lg font-bold text-foreground">{currentSubscription.periodEnd}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="accent" onClick={() => setShowPlans(!showPlans)}>
              {showPlans ? 'Hide Plans' : 'Change Plan'}
            </Button>
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      {showPlans && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className={cn('text-sm font-medium', billingCycle === 'MONTHLY' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
              className={`relative w-11 h-6 rounded-full transition-colors ${billingCycle === 'YEARLY' ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${billingCycle === 'YEARLY' ? 'translate-x-5' : ''}`} />
            </button>
            <span className={cn('text-sm font-medium', billingCycle === 'YEARLY' ? 'text-foreground' : 'text-muted-foreground')}>
              Yearly <Badge className="bg-success/10 text-success border-0 text-[10px] ml-1">Save 17%</Badge>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentSubscription.planId;
              const price = billingCycle === 'MONTHLY' ? plan.priceMonthly : plan.priceYearly;
              return (
                <Card key={plan.id} className={cn(isCurrent && 'border-primary ring-2 ring-primary/20')}>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <plan.icon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                      {isCurrent && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Current</Badge>}
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-foreground">EUR {price}</span>
                      <span className="text-muted-foreground">/{billingCycle === 'MONTHLY' ? 'mo' : 'yr'}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="w-3.5 h-3.5 text-success shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isCurrent ? 'outline' : 'accent'}
                      className="w-full"
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : 'Switch to ' + plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Description</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 text-muted-foreground">{payment.date}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{payment.description}</td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">EUR {payment.amount}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge className="bg-success/10 text-success border-0 text-[10px]">Paid</Badge>
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
