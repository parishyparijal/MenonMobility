<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl md:text-3xl font-bold text-navy mb-8">My Favorites</h1>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div class="h-48 bg-gray-200" />
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-4 bg-gray-200 rounded w-1/2" />
            <div class="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!favorites.length" class="text-center py-20">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-navy mb-2">No saved listings yet</h2>
        <p class="text-gray-500 mb-6 max-w-md mx-auto">
          When you find a vehicle you like, click the heart icon to save it here for easy access later.
        </p>
        <NuxtLink
          to="/search"
          class="inline-block bg-orange hover:bg-orange-light text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Listings
        </NuxtLink>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="listing in favorites"
          :key="listing.id"
          class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group relative"
        >
          <button
            @click.prevent="toggleFavorite(listing.id)"
            class="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <NuxtLink :to="`/${listing.category}/${listing.slug}`">
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img
                v-if="listing.images.length"
                :src="listing.images[0].thumbnail"
                :alt="listing.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="absolute top-3 left-3 bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">{{ listing.condition }}</span>
            </div>
            <div class="p-4">
              <p class="text-xs text-gray-500 mb-1">{{ listing.brand }} &middot; {{ listing.year }}</p>
              <h3 class="font-semibold text-navy text-sm leading-tight line-clamp-2 mb-2">{{ listing.title }}</h3>
              <p class="text-orange font-bold text-lg">{{ listing.currency }} {{ listing.price.toLocaleString() }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ listing.location }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { favorites, isLoading, fetchFavorites, toggleFavorite } = useFavorites()

onMounted(() => {
  fetchFavorites()
})

useHead({
  title: 'My Favorites - MenonTrucks',
})
</script>
