import Link from 'next/link';
import {
  Search,
  MessageSquare,
  Handshake,
  Truck,
  Shield,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Menon Mobility',
  description: 'Learn how to buy and sell commercial vehicles on Menon Mobility. Simple, transparent, and secure.',
};

const buyerSteps = [
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Browse thousands of trucks, trailers, and equipment. Use advanced filters to find exactly what you need by brand, price, condition, and location.',
  },
  {
    icon: MessageSquare,
    title: 'Contact Sellers',
    description: 'Send messages directly to sellers through our secure platform. Ask questions, request more photos, or arrange an inspection.',
  },
  {
    icon: Shield,
    title: 'Verify & Inspect',
    description: 'Review seller profiles, ratings, and reviews. Arrange an in-person inspection or request a video walkthrough before making a decision.',
  },
  {
    icon: Handshake,
    title: 'Complete the Deal',
    description: 'Negotiate directly with the seller and complete the transaction. We provide a safe environment for communication throughout the process.',
  },
];

const sellerSteps = [
  {
    icon: Users,
    title: 'Create Your Account',
    description: 'Sign up as a seller in minutes. Set up your company profile with your logo, description, and contact details.',
  },
  {
    icon: Truck,
    title: 'List Your Vehicles',
    description: 'Add detailed listings with photos, specifications, and pricing. Our step-by-step wizard makes it easy to create professional listings.',
  },
  {
    icon: Globe,
    title: 'Reach Buyers Globally',
    description: 'Your listings are visible to buyers across 50+ countries. Use featured listings to get even more visibility.',
  },
  {
    icon: Star,
    title: 'Build Your Reputation',
    description: 'Earn reviews from satisfied buyers. A strong reputation helps you sell faster and attract more customers.',
  },
];

const benefits = [
  { icon: Globe, title: '50+ Countries', description: 'Reach buyers and sellers across the globe' },
  { icon: Shield, title: 'Verified Dealers', description: 'All dealers are verified for your safety' },
  { icon: Clock, title: '24/7 Access', description: 'Browse and list vehicles anytime, anywhere' },
  { icon: CheckCircle, title: 'No Hidden Fees', description: 'Transparent pricing with no surprises' },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Menon Mobility Works</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Whether you&apos;re buying or selling, we make it simple. Here&apos;s how our marketplace connects you with the right people.
          </p>
        </div>
      </section>

      {/* For Buyers */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">For Buyers</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find your perfect vehicle in four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {buyerSteps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-8 h-8 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {i < buyerSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-6 h-6 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="accent" size="lg" asChild>
            <Link href="/search">Start Browsing <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-border" />
      </div>

      {/* For Sellers */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">For Sellers</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start selling your vehicles to a global audience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {sellerSteps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-8 h-8 text-accent" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {i < sellerSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-6 h-6 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="default" size="lg" asChild>
            <Link href="/register">Create Seller Account <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose Menon Mobility?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join the fastest-growing commercial vehicle marketplace worldwide.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button variant="accent" size="lg" asChild>
              <Link href="/search">Browse Vehicles</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10" asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
