<script setup lang="ts">
const stats = [
  {
    number: '150,000+',
    label: 'Listings',
    icon: 'listing',
  },
  {
    number: '5,000+',
    label: 'Verified Sellers',
    icon: 'seller',
  },
  {
    number: '20+',
    label: 'Countries',
    icon: 'country',
  },
]
</script>

<template>
  <section class="bg-gray-50 py-12 sm:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center"
        >
          <!-- Icon -->
          <div class="w-14 h-14 mb-4 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
            <!-- Listing Icon -->
            <svg
              v-if="stat.icon === 'listing'"
              class="w-7 h-7 text-[#FF6B35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <!-- Seller Icon -->
            <svg
              v-else-if="stat.icon === 'seller'"
              class="w-7 h-7 text-[#FF6B35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <!-- Country Icon -->
            <svg
              v-else-if="stat.icon === 'country'"
              class="w-7 h-7 text-[#FF6B35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Number -->
          <p class="text-3xl sm:text-4xl font-bold text-[#1E2B47] mb-1">
            {{ stat.number }}
          </p>

          <!-- Label -->
          <p class="text-gray-500 font-medium">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
