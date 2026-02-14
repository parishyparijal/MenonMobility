import Link from 'next/link';
import { Truck, Globe, Shield, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Menon Mobility',
  description: 'Learn about Menon Mobility - Europe\'s premier marketplace for trucks, trailers, and commercial vehicles.',
};

const stats = [
  { label: 'Active Listings', value: '50,000+' },
  { label: 'Verified Dealers', value: '5,000+' },
  { label: 'Countries', value: '30+' },
  { label: 'Monthly Visitors', value: '2M+' },
];

const values = [
  { icon: Shield, title: 'Trust & Transparency', description: 'Every listing is verified. We ensure accurate descriptions and fair pricing to build trust between buyers and sellers.' },
  { icon: Globe, title: 'Global Reach', description: 'Connect with buyers and sellers across 30+ countries. Our platform breaks down borders in the commercial vehicle market.' },
  { icon: Users, title: 'Community First', description: 'We build tools that empower our community of dealers, fleet operators, and individual buyers to do business efficiently.' },
  { icon: Award, title: 'Quality Standards', description: 'We maintain high quality standards for all listings, ensuring buyers can shop with confidence on our platform.' },
];

const team = [
  { name: 'Menon Group', role: 'Parent Company', description: 'A diversified business group with decades of experience in logistics and transportation.' },
  { name: 'European Operations', role: 'Headquarters', description: 'Our European headquarters coordinates operations across the continent, ensuring seamless service delivery.' },
  { name: 'Technology Team', role: 'Engineering', description: 'Our technology team builds and maintains the platform, ensuring a fast, reliable, and secure experience.' },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary-950 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting the Commercial Vehicle World
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Menon Mobility is Europe&apos;s fastest-growing marketplace for trucks, trailers,
              construction equipment, and commercial vehicles. We connect buyers and sellers
              across borders, making it easier than ever to find the right vehicle for your business.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="accent" size="lg" asChild>
                <Link href="/search">Browse Listings</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To become the most trusted and comprehensive marketplace for commercial vehicles in Europe.
            We aim to simplify the buying and selling process, provide transparent pricing,
            and connect our global community of dealers and buyers.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Organization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl border border-border p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join thousands of dealers and buyers already using Menon Mobility.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link href="/register">Create Account <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
