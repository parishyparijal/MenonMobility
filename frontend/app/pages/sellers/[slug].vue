<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Seller Header -->
    <div class="bg-navy text-white py-12">
      <div class="container mx-auto px-4">
        <div v-if="seller" class="flex flex-col md:flex-row items-start md:items-center gap-6">
          <!-- Logo -->
          <div class="w-20 h-20 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            <img v-if="seller.avatar" :src="seller.avatar" :alt="seller.company || seller.name" class="w-full h-full object-cover" />
            <span v-else class="text-3xl font-bold text-navy">{{ (seller.company || seller.name).charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-2xl md:text-3xl font-bold">{{ seller.company || seller.name }}</h1>
              <span v-if="seller.verified" class="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                Verified Seller
              </span>
            </div>
            <div class="flex items-center gap-4 text-gray-300 text-sm">
              <span v-if="seller.location" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ seller.location }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Member since {{ new Date(seller.created_at).getFullYear() }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="animate-pulse flex items-center gap-6">
          <div class="w-20 h-20 rounded-xl bg-navy-light" />
          <div class="space-y-3">
            <div class="h-8 bg-navy-light rounded w-64" />
            <div class="h-4 bg-navy-light rounded w-48" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-8">
          <div class="text-center">
            <p class="text-2xl font-bold text-navy">{{ totalListings }}</p>
            <p class="text-sm text-gray-500">Active Listings</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-navy">{{ seller?.response_rate || '95' }}%</p>
            <p class="text-sm text-gray-500">Response Rate</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Listings -->
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-xl font-bold text-navy mb-6">All Listings</h2>

      <div v-if="listingsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div class="h-48 bg-gray-200" />
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>

      <div v-else-if="!listings.length" class="text-center py-16">
        <p class="text-gray-500">This seller has no active listings.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="listing in listings"
          :key="listing.id"
          :to="`/${listing.category.slug}/${listing.slug}`"
          class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
        >
          <div class="relative h-48 bg-gray-100 overflow-hidden">
            <img v-if="listing.images.length" :src="listing.images[0].thumbnail" :alt="listing.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span class="absolute top-3 right-3 bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">{{ listing.condition }}</span>
          </div>
          <div class="p-4">
            <p class="text-xs text-gray-500 mb-1">{{ listing.brand.name }} &middot; {{ listing.year }}</p>
            <h3 class="font-semibold text-navy text-sm line-clamp-2 mb-2">{{ listing.title }}</h3>
            <p class="text-orange font-bold text-lg">{{ listing.currency }} {{ listing.price.toLocaleString() }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ listing.location }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-10">
        <button @click="page = Math.max(1, page - 1)" :disabled="page === 1" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:border-orange hover:text-orange transition-colors">Previous</button>
        <span class="px-4 py-2 text-sm text-gray-600">Page {{ page }} of {{ lastPage }}</span>
        <button @click="page = Math.min(lastPage, page + 1)" :disabled="page === lastPage" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:border-orange hover:text-orange transition-colors">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $api } = useNuxtApp()

interface SellerProfile {
  id: number
  name: string
  company?: string
  avatar?: string
  verified: boolean
  location?: string
  created_at: string
  response_rate?: number
}

const seller = ref<SellerProfile | null>(null)
const listings = ref<any[]>([])
const totalListings = ref(0)
const lastPage = ref(1)
const page = ref(1)
const listingsLoading = ref(true)

// SSR fetch seller
const { data: sellerData } = await useAsyncData(`seller-${route.params.slug}`, async () => {
  try {
    return await $api<{ data: SellerProfile }>(`/sellers/${route.params.slug}`)
  } catch {
    return null
  }
})

if (sellerData.value) {
  seller.value = sellerData.value.data
}

const fetchSellerListings = async () => {
  listingsLoading.value = true
  try {
    const res = await $api<{ data: any[]; meta: { total: number; last_page: number } }>(`/sellers/${route.params.slug}/listings`, {
      params: { page: page.value },
    })
    listings.value = res.data
    totalListings.value = res.meta.total
    lastPage.value = res.meta.last_page
  } catch {
    listings.value = []
  } finally {
    listingsLoading.value = false
  }
}

watch(page, () => fetchSellerListings())

onMounted(() => fetchSellerListings())

useHead({
  title: computed(() => `${seller.value?.company || seller.value?.name || 'Seller'} - MenonTrucks`),
})
</script>
