<template>
  <div>
    <section class="bg-navy text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Privacy Policy</h1>
        <p class="text-gray-300 mt-2">Last updated: February 14, 2026</p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-3xl mx-auto prose prose-navy">
        <div class="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 class="text-xl font-bold text-navy mb-3">1. Introduction</h2>
            <p>MenonTrucks GmbH ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, password, phone number, and company details when you register for an account.</li>
              <li><strong>Listing Information:</strong> Vehicle details, images, pricing, and location data when you create a listing.</li>
              <li><strong>Communication Data:</strong> Messages sent through our messaging system.</li>
              <li><strong>Payment Information:</strong> Billing details for premium services (processed securely by our payment partners).</li>
            </ul>
            <p class="mt-3">We also automatically collect certain information when you use our Service:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>IP address, browser type, and device information</li>
              <li>Pages viewed, time spent on pages, and navigation patterns</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and manage your account</li>
              <li>Facilitate communication between buyers and sellers</li>
              <li>Send you updates, security alerts, and support messages</li>
              <li>Detect, prevent, and address fraud and security issues</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">4. Sharing of Information</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>With Other Users:</strong> Your seller profile, listings, and contact information are visible to potential buyers.</li>
              <li><strong>Service Providers:</strong> We share information with third-party companies that help us operate our Service (hosting, analytics, email delivery).</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">5. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">6. Your Rights (GDPR)</h2>
            <p>As a user in the European Economic Area, you have the following rights under GDPR:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Access:</strong> You can request a copy of your personal data.</li>
              <li><strong>Rectification:</strong> You can request correction of inaccurate data.</li>
              <li><strong>Erasure:</strong> You can request deletion of your personal data.</li>
              <li><strong>Restriction:</strong> You can request that we limit the processing of your data.</li>
              <li><strong>Portability:</strong> You can request your data in a machine-readable format.</li>
              <li><strong>Objection:</strong> You can object to the processing of your personal data.</li>
            </ul>
            <p class="mt-2">To exercise any of these rights, please contact us at privacy@menontrucks.com.</p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">7. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our Service may not function properly.</p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">8. Data Retention</h2>
            <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-navy mb-3">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact our Data Protection Officer:</p>
            <p class="mt-2">
              MenonTrucks GmbH<br />
              Data Protection Officer<br />
              Email: privacy@menontrucks.com<br />
              Address: Hauptstrasse 42, 80331 Munich, Germany
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Privacy Policy - MenonTrucks',
  meta: [
    { name: 'description', content: 'Read the MenonTrucks Privacy Policy. Learn how we collect, use, and protect your personal information.' },
  ],
})
</script>
