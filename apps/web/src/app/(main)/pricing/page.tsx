import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: '',
    description: 'Get started with basic features',
    cta: 'Start Free',
    ctaVariant: 'outline' as const,
    highlighted: false,
    features: {
      'Active listings': '3',
      'Photos per listing': '5',
      'Listing duration': '30 days',
      'Basic analytics': true,
      'Email support': true,
      'Featured listings': false,
      'Priority placement': false,
      'Company profile page': false,
      'Social media promotion': false,
      'Dedicated account manager': false,
      'API access': false,
      'Custom branding': false,
    },
  },
  {
    name: 'Basic',
    price: 29,
    period: '/month',
    description: 'Perfect for individual sellers',
    cta: 'Get Started',
    ctaVariant: 'default' as const,
    highlighted: false,
    features: {
      'Active listings': '15',
      'Photos per listing': '15',
      'Listing duration': '60 days',
      'Basic analytics': true,
      'Email support': true,
      'Featured listings': '1/month',
      'Priority placement': false,
      'Company profile page': true,
      'Social media promotion': false,
      'Dedicated account manager': false,
      'API access': false,
      'Custom branding': false,
    },
  },
  {
    name: 'Pro',
    price: 79,
    period: '/month',
    description: 'For growing dealerships',
    cta: 'Get Pro',
    ctaVariant: 'accent' as const,
    highlighted: true,
    features: {
      'Active listings': '100',
      'Photos per listing': '30',
      'Listing duration': '90 days',
      'Basic analytics': true,
      'Email support': true,
      'Featured listings': '5/month',
      'Priority placement': true,
      'Company profile page': true,
      'Social media promotion': true,
      'Dedicated account manager': false,
      'API access': true,
      'Custom branding': false,
    },
  },
  {
    name: 'Enterprise',
    price: 199,
    period: '/month',
    description: 'For large dealer groups',
    cta: 'Contact Sales',
    ctaVariant: 'default' as const,
    highlighted: false,
    features: {
      'Active listings': 'Unlimited',
      'Photos per listing': '50',
      'Listing duration': '180 days',
      'Basic analytics': true,
      'Email support': true,
      'Featured listings': '20/month',
      'Priority placement': true,
      'Company profile page': true,
      'Social media promotion': true,
      'Dedicated account manager': true,
      'API access': true,
      'Custom branding': true,
    },
  },
];

const featureKeys = Object.keys(plans[0].features);

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-[#0F1F32] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative overflow-hidden',
                plan.highlighted && 'border-accent shadow-lg ring-2 ring-accent'
              )}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-accent text-white text-center text-xs font-semibold py-1">
                  Most Popular
                </div>
              )}
              <CardHeader className={cn(plan.highlighted && 'pt-10')}>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price === 0 ? 'Free' : `EUR ${plan.price}`}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant={plan.ctaVariant}
                  className="w-full mb-6"
                  asChild
                >
                  <Link href="/register">{plan.cta}</Link>
                </Button>
                <ul className="space-y-3">
                  {featureKeys.map((feature) => {
                    const value = plan.features[feature as keyof typeof plan.features];
                    const hasFeature = value !== false;
                    return (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        {hasFeature ? (
                          <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                        )}
                        <span className={cn(!hasFeature && 'text-muted-foreground/60')}>
                          {feature}
                          {typeof value === 'string' && value !== 'true' && (
                            <span className="font-medium text-foreground"> ({value})</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Detailed Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground min-w-[200px]">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.name} className="text-center py-4 px-4 text-sm font-semibold text-foreground min-w-[120px]">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((feature) => (
                <tr key={feature} className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-foreground">{feature}</td>
                  {plans.map((plan) => {
                    const value = plan.features[feature as keyof typeof plan.features];
                    return (
                      <td key={plan.name} className="py-3 px-4 text-center">
                        {value === true ? (
                          <Check className="w-4 h-4 text-success mx-auto" />
                        ) : value === false ? (
                          <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-foreground">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ or CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need a custom plan?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We offer custom solutions for large dealer groups and fleet operators.
            Contact our sales team to discuss your needs.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
