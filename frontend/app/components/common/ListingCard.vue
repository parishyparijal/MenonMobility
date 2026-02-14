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
  condition: 'New' | 'Used' | string
  brand_name: string | null
  is_featured: boolean
  seller_name: string | null
}

const props = defineProps<{
  listing: Listing
}>()

const emit = defineEmits<{
  (e: 'toggle-favorite', id: number | string): void
}>()

const isFavorited = ref(false)

const formattedPrice = computed(() => {
  if (props.listing.price_on_request || !props.listing.price) {
    return 'Price on request'
  }
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.listing.price)
})

const formattedMileage = computed(() => {
  if (!props.listing.mileage_km) return null
  return `${new Intl.NumberFormat('en').format(props.listing.mileage_km)} km`
})

const conditionBadgeClass = computed(() => {
  return props.listing.condition === 'New'
    ? 'bg-green-500 text-white'
    : 'bg-gray-500 text-white'
})

const listingUrl = computed(() => {
  return `/${props.listing.category_slug}/${props.listing.slug}`
})

function toggleFavorite(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  isFavorited.value = !isFavorited.value
  emit('toggle-favorite', props.listing.id)
}
</script>

<template>
  <NuxtLink
    :to="listingUrl"
    class="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
  >
    <!-- Image Section -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        v-if="listing.image_url"
        :src="listing.image_url"
        :alt="listing.title"
        class="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl"
      >
        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Featured Badge -->
      <span
        v-if="listing.is_featured"
        class="absolute top-3 left-3 bg-[#FF6B35] text-white text-xs font-semibold px-2.5 py-1 rounded-full"
      >
        Featured
      </span>

      <!-- Condition Badge -->
      <span
        v-if="listing.condition"
        class="absolute top-3 right-12 text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="conditionBadgeClass"
      >
        {{ listing.condition }}
      </span>

      <!-- Favorite Button -->
      <button
        type="button"
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
        :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
        @click="toggleFavorite"
      >
        <svg
          class="w-5 h-5 transition-colors duration-200"
          :class="isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            :fill="isFavorited ? 'currentColor' : 'none'"
          />
        </svg>
      </button>
    </div>

    <!-- Content Section -->
    <div class="p-4">
      <!-- Title -->
      <h3 class="font-semibold text-[#1E2B47] text-sm leading-snug line-clamp-2 mb-2">
        {{ listing.title }}
      </h3>

      <!-- Price -->
      <p
        class="text-xl font-bold mb-3"
        :class="listing.price_on_request || !listing.price ? 'text-gray-500 text-base' : 'text-[#FF6B35]'"
      >
        {{ formattedPrice }}
      </p>

      <!-- Specs Row -->
      <div class="flex items-center text-xs text-gray-500 space-x-2 mb-2">
        <span v-if="listing.year">{{ listing.year }}</span>
        <span v-if="listing.year && formattedMileage" class="text-gray-300">|</span>
        <span v-if="formattedMileage">{{ formattedMileage }}</span>
        <span v-if="(listing.year || formattedMileage) && listing.fuel_type" class="text-gray-300">|</span>
        <span v-if="listing.fuel_type">{{ listing.fuel_type }}</span>
      </div>

      <!-- Location -->
      <div v-if="listing.location" class="flex items-center text-xs text-gray-500 mb-2">
        <svg class="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="truncate">{{ listing.location }}</span>
      </div>

      <!-- Seller Name -->
      <p v-if="listing.seller_name" class="text-xs text-gray-400 truncate">
        {{ listing.seller_name }}
      </p>
    </div>
  </NuxtLink>
</template>
