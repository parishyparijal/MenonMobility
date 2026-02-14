'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, Truck, CreditCard, Shield, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  name: string;
  icon: React.ElementType;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    name: 'Buying',
    icon: Truck,
    items: [
      {
        question: 'How do I search for vehicles?',
        answer: 'Use the search bar on the homepage or navigate to the Search page. You can filter by category, brand, price range, condition, location, and many other criteria. Save your searches to get notified when new matching listings appear.',
      },
      {
        question: 'How do I contact a seller?',
        answer: 'Click the "Contact Seller" button on any listing page. You can send a message directly through our platform. Your conversation will appear in your Messages inbox for easy follow-up.',
      },
      {
        question: 'Can I inspect a vehicle before buying?',
        answer: 'We strongly recommend inspecting vehicles in person before purchase. Contact the seller to arrange a viewing. Some sellers also offer video inspections for international buyers.',
      },
      {
        question: 'Does Menon Mobility handle payments?',
        answer: 'Menon Mobility is a marketplace that connects buyers and sellers. Transactions are conducted directly between parties. We recommend using secure payment methods and verifying all details before making a payment.',
      },
      {
        question: 'Can I compare vehicles?',
        answer: 'Yes! Use the Compare feature to select up to 4 vehicles and see a side-by-side comparison of their specifications, prices, and features.',
      },
    ],
  },
  {
    name: 'Selling',
    icon: CreditCard,
    items: [
      {
        question: 'How do I list a vehicle for sale?',
        answer: 'Register as a seller, then go to your Seller Dashboard and click "Add Listing". Fill in the vehicle details, upload photos, set your price, and submit for review. Listings are typically approved within 24 hours.',
      },
      {
        question: 'What does it cost to list a vehicle?',
        answer: 'We offer a Free plan with 3 listings, and paid plans starting at EUR 29/month for more features and listings. Visit our Pricing page for a detailed comparison of plans.',
      },
      {
        question: 'How many photos can I upload?',
        answer: 'The number of photos depends on your subscription plan: Free (5), Basic (15), Pro (30), Enterprise (50). We recommend uploading as many quality photos as possible to attract buyers.',
      },
      {
        question: 'How do featured listings work?',
        answer: 'Featured listings appear at the top of search results and on the homepage, getting significantly more views. The number of featured listings included depends on your plan. Additional featured slots can be purchased separately.',
      },
      {
        question: 'Can I import listings in bulk?',
        answer: 'Yes! Pro and Enterprise plan subscribers can use our Bulk Upload feature to import multiple listings from a CSV or Excel file. Download our template from the Bulk Upload page in your Seller Dashboard.',
      },
    ],
  },
  {
    name: 'Account & Security',
    icon: Shield,
    items: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Sign Up" in the top right corner. You can register as a Buyer (to browse and purchase) or as a Seller (to list and sell vehicles). You will need a valid email address to verify your account.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page. Enter your email address and we will send you a reset link. The link expires after 1 hour for security reasons.',
      },
      {
        question: 'Is my personal data safe?',
        answer: 'Yes. We use industry-standard encryption and security measures to protect your data. We are GDPR compliant and never sell your personal information. Read our Privacy Policy for full details.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team at support@menonmobility.com to request account deletion. We will process your request within 30 days as required by GDPR. Note that this action is irreversible.',
      },
    ],
  },
  {
    name: 'Support',
    icon: MessageSquare,
    items: [
      {
        question: 'How do I report a suspicious listing?',
        answer: 'Click the "Report" button on any listing page. Provide details about your concern and our team will investigate within 24 hours. You can also email reports@menonmobility.com.',
      },
      {
        question: 'What if I have a dispute with a seller?',
        answer: 'Contact our support team with details of the dispute. While transactions are between buyers and sellers, we can mediate and take action against sellers who violate our terms, including removing listings and suspending accounts.',
      },
      {
        question: 'How do I contact support?',
        answer: 'Email us at support@menonmobility.com, use the Contact form on our website, or send a message through your account dashboard. Our support team responds within 24 hours on business days.',
      },
    ],
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    const next = new Set(openItems);
    if (next.has(key)) next.delete(key); else next.add(key);
    setOpenItems(next);
  };

  const filteredCategories = faqCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !searchQuery ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) =>
    (!activeCategory || cat.name === activeCategory) && cat.items.length > 0
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-accent" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Find answers to common questions about buying, selling, and using Menon Mobility.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full border-0 bg-white text-foreground text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              !activeCategory ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted border border-border'
            )}
          >
            All
          </button>
          {faqCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat.name ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted border border-border'
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredCategories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center gap-2 mb-4">
                <cat.icon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{cat.name}</h2>
              </div>
              <div className="space-y-2">
                {cat.items.map((item, i) => {
                  const key = `${cat.name}-${i}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div key={key} className="bg-white rounded-xl border border-border overflow-hidden">
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="text-sm font-medium text-foreground pr-4">{item.question}</span>
                        <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 transition-transform', isOpen && 'rotate-180')} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="max-w-3xl mx-auto mt-16 bg-white rounded-xl border border-border p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help. Get in touch and we&apos;ll respond within 24 hours.
          </p>
          <Button variant="accent" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
