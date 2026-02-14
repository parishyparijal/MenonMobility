<template>
  <div>
    <!-- Hero -->
    <section class="bg-navy text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">About MenonTrucks</h1>
        <p class="text-gray-300 text-lg max-w-2xl mx-auto">Connecting buyers and sellers of commercial vehicles worldwide since 2020.</p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-16">
      <!-- Mission -->
      <div class="max-w-3xl mx-auto mb-16">
        <h2 class="text-2xl font-bold text-navy mb-6">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          MenonTrucks was founded with a simple mission: to make buying and selling commercial vehicles as easy and transparent as possible. We believe that every dealer, no matter their size, should have access to a global marketplace where they can reach qualified buyers efficiently.
        </p>
        <p class="text-gray-600 leading-relaxed">
          Our platform connects thousands of commercial vehicle dealers with buyers across the globe. Whether you are looking for a heavy-duty truck, a specialized trailer, construction equipment, or replacement parts, MenonTrucks is your trusted marketplace.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div class="text-center">
          <p class="text-4xl font-bold text-orange">150K+</p>
          <p class="text-gray-500 mt-1">Active Listings</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-bold text-orange">45K+</p>
          <p class="text-gray-500 mt-1">Registered Dealers</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-bold text-orange">120+</p>
          <p class="text-gray-500 mt-1">Countries</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-bold text-orange">2M+</p>
          <p class="text-gray-500 mt-1">Monthly Visitors</p>
        </div>
      </div>

      <!-- Values -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-navy mb-8 text-center">Our Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 rounded-xl p-8">
            <div class="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-navy mb-2">Trust & Transparency</h3>
            <p class="text-gray-500 text-sm leading-relaxed">We verify every seller to ensure genuine listings. Our platform promotes honest, transparent dealings between buyers and sellers.</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-8">
            <div class="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-navy mb-2">Global Reach</h3>
            <p class="text-gray-500 text-sm leading-relaxed">With sellers from over 120 countries, we provide the most diverse inventory of commercial vehicles available anywhere online.</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-8">
            <div class="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-navy mb-2">Innovation</h3>
            <p class="text-gray-500 text-sm leading-relaxed">We continuously improve our platform with the latest technology to provide the best experience for our users.</p>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-navy mb-4">Our Team</h2>
        <p class="text-gray-500 max-w-2xl mx-auto mb-8">Our diverse team of professionals is passionate about the commercial vehicle industry and dedicated to building the best marketplace for our users.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div v-for="member in team" :key="member.name">
            <div class="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <span class="text-2xl font-bold text-gray-400">{{ member.initials }}</span>
            </div>
            <p class="font-semibold text-navy text-sm">{{ member.name }}</p>
            <p class="text-xs text-gray-500">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const team = [
  { name: 'Rajan Menon', initials: 'RM', role: 'CEO & Founder' },
  { name: 'Sarah Chen', initials: 'SC', role: 'CTO' },
  { name: 'Marcus Weber', initials: 'MW', role: 'Head of Sales' },
  { name: 'Priya Sharma', initials: 'PS', role: 'Head of Product' },
]

useHead({
  title: 'About Us - MenonTrucks',
  meta: [
    { name: 'description', content: 'Learn about MenonTrucks - the leading commercial vehicle marketplace connecting buyers and sellers worldwide.' },
  ],
})
</script>
