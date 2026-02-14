import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Menon Mobility',
  description: 'Terms of Service for using the Menon Mobility marketplace.',
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-gradient-to-br from-primary to-primary-950 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-white/70 mt-2">Last updated: January 15, 2024</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-sm prose-gray">
          <div className="bg-white rounded-xl border border-border p-8 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the Menon Mobility platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Menon Mobility provides an online marketplace platform for buying and selling commercial vehicles, including but not limited to trucks, trailers, construction equipment, vans, and related parts and accessories. We act as an intermediary connecting buyers and sellers and do not own, sell, or purchase any vehicles listed on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Listings and Transactions</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sellers are solely responsible for the accuracy of their listings, including descriptions, images, pricing, and availability. Menon Mobility does not guarantee the quality, safety, or legality of listed items. All transactions are conducted directly between buyers and sellers. We encourage buyers to inspect vehicles in person before completing a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Fees and Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Certain features of the Service require payment of fees, including subscription plans and featured listings. All fees are stated in Euros (EUR) unless otherwise specified. Fees are non-refundable except as required by applicable law. We reserve the right to change our pricing at any time with reasonable notice to users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users may not: (a) post false, misleading, or fraudulent listings; (b) use the Service for any illegal purpose; (c) harass, abuse, or harm other users; (d) attempt to circumvent any security features; (e) scrape or collect data from the Service without permission; (f) post spam or unsolicited advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and functionality are owned by Menon Mobility and are protected by international copyright, trademark, and other intellectual property laws. Users retain ownership of content they submit but grant us a non-exclusive license to use, display, and distribute such content on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Menon Mobility shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount paid by you to Menon Mobility in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by the laws of the European Union and the applicable national law of the Netherlands. Any disputes shall be subject to the exclusive jurisdiction of the courts in Amsterdam, the Netherlands.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please contact us at legal@menonmobility.com or visit our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
