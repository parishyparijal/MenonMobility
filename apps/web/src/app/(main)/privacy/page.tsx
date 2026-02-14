import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Menon Mobility',
  description: 'Privacy Policy for Menon Mobility - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-gradient-to-br from-primary to-primary-950 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-white/70 mt-2">Last updated: January 15, 2024</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-border p-8 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Account information (name, email, phone number)</li>
                <li>Profile information (company name, address, website)</li>
                <li>Listing data (vehicle details, photos, pricing)</li>
                <li>Communication data (messages between users)</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Usage data (pages visited, search queries, interactions)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
                <li>Personalize and improve your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your information with: (a) service providers who assist in our operations; (b) law enforcement when required by law; (c) other users as part of the marketplace functionality (e.g., your seller profile is visible to buyers). We ensure all third parties comply with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest, regular security audits, and access controls.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to collect and track information about your use of our Service. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. Essential cookies are required for the Service to function properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">Under GDPR, you have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements. Account data is retained for the duration of your account and for 30 days after deletion. Transaction records are retained for 7 years as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries outside of the European Economic Area (EEA). In such cases, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not directed to individuals under 18 years of age. We do not knowingly collect personal data from children. If we become aware that we have collected personal data from a child, we will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this Privacy Policy or to exercise your data protection rights, contact our Data Protection Officer at privacy@menonmobility.com or write to: Menon Mobility, Data Protection Officer, Amsterdam, Netherlands.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
