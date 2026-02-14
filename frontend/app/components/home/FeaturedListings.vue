<script setup lang="ts">
interface Listing {
  id: number | string
  title: string
  slug: string
  category_slug: string
  price: number | null
  price_on_request: boolean
  year: number | null
  mileage_km: number | null
  fuel_type: string | null
  location: string | null
  image_url: string | null
  condition: string
  brand_name: string | null
  is_featured: boolean
  seller_name: string | null
}

defineProps<{
  listings: Listing[]
}>()

const scrollContainer = ref<HTMLElement | null>(null)

function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -320, behavior: 'smooth' })
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 320, behavior: 'smooth' })
  }
}
</script>

<template>
  <section>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-[#1E2B47]">Featured Listings</h2>
      <div class="flex items-center space-x-3">
        <NuxtLink
          to="/search?featured=true"
          class="text-sm font-medium text-[#FF6B35] hover:text-[#FF8C5E] transition-colors duration-200"
        >
          View All
        </NuxtLink>

        <!-- Scroll Arrows (desktop only) -->
        <div class="hidden md:flex items-center space-x-2">
          <button
            type="button"
            class="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-[#1E2B47] hover:border-[#1E2B47] transition-colors duration-200"
            aria-label="Scroll left"
            @click="scrollLeft"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            class="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-[#1E2B47] hover:border-[#1E2B47] transition-colors duration-200"
            aria-label="Scroll right"
            @click="scrollRight"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Listings Scroll Row -->
    <div
      ref="scrollContainer"
      class="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory"
    >
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
      >
        <CommonListingCard :listing="listing" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="listings.length === 0" class="text-center py-12 text-gray-400">
      <p>No featured listings available right now.</p>
    </div>
  </section>
</template>
