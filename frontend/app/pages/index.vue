<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-navy min-h-[540px] flex items-center">
      <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
      <div class="absolute inset-0 opacity-10">
        <div class="w-full h-full bg-[url('/images/hero-trucks.jpg')] bg-cover bg-center" />
      </div>
      <div class="relative container mx-auto px-4 py-20 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Find Your Perfect<br />
          <span class="text-orange">Commercial Vehicle</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Browse thousands of trucks, trailers, equipment, and parts from verified dealers worldwide.
        </p>

        <!-- Search Bar -->
        <div class="max-w-3xl mx-auto">
          <form @submit.prevent="handleSearch" class="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl shadow-2xl">
            <select
              v-model="searchCategory"
              class="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-orange sm:w-48"
            >
              <option value="">All Categories</option>
              <option value="trucks">Trucks</option>
              <option value="trailers">Trailers</option>
              <option value="vans">Vans</option>
              <option value="equipment">Equipment</option>
              <option value="parts">Parts</option>
              <option value="cars">Cars</option>
            </select>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by make, model, or keyword..."
              class="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-navy focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <button
              type="submit"
              class="bg-orange hover:bg-orange-light text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Quick Category Icons -->
    <section class="bg-white py-12 border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-3 md:grid-cols-6 gap-6">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/${cat.slug}`"
            class="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-orange-lighter transition-colors group"
          >
            <div class="w-16 h-16 bg-gray-100 group-hover:bg-orange/10 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-8 h-8 text-navy group-hover:text-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="cat.icon" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-navy group-hover:text-orange transition-colors">{{ cat.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Listings -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-navy">Featured Listings</h2>
            <p class="text-gray-500 mt-1">Hand-picked vehicles from top dealers</p>
          </div>
          <NuxtLink to="/search?featured=true" class="text-orange hover:text-orange-light font-semibold transition-colors hidden sm:block">
            View All &rarr;
          </NuxtLink>
        </div>
        <div v-if="featuredLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div class="h-48 bg-gray-200" />
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-4 bg-gray-200 rounded w-1/2" />
              <div class="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="listing in featuredListings"
            :key="listing.id"
            :to="`/${listing.category.slug}/${listing.slug}`"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
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
              <span v-if="listing.is_featured" class="absolute top-3 left-3 bg-orange text-white text-xs font-semibold px-2 py-1 rounded-full">
                Featured
              </span>
              <span class="absolute top-3 right-3 bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">
                {{ listing.condition }}
              </span>
            </div>
            <div class="p-4">
              <p class="text-xs text-gray-500 mb-1">{{ listing.brand.name }} &middot; {{ listing.year }}</p>
              <h3 class="font-semibold text-navy text-sm leading-tight line-clamp-2 mb-2">{{ listing.title }}</h3>
              <p class="text-orange font-bold text-lg">
                {{ listing.currency }} {{ listing.price.toLocaleString() }}
              </p>
              <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ listing.location }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why MenonTrucks -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-navy text-center mb-12">Why MenonTrucks?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-xl bg-gray-50">
            <div class="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-navy mb-2">150K+ Listings</h3>
            <p class="text-gray-500">Browse the largest inventory of commercial vehicles, equipment, and parts from sellers across the globe.</p>
          </div>
          <div class="text-center p-8 rounded-xl bg-gray-50">
            <div class="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-navy mb-2">Verified Sellers</h3>
            <p class="text-gray-500">Every dealer is verified. Trade with confidence knowing you are dealing with legitimate businesses.</p>
          </div>
          <div class="text-center p-8 rounded-xl bg-gray-50">
            <div class="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-navy mb-2">Easy Contact</h3>
            <p class="text-gray-500">Reach sellers instantly via phone, WhatsApp, or our built-in messaging system. No barriers.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Listings -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-navy">Recent Listings</h2>
            <p class="text-gray-500 mt-1">Just added by our sellers</p>
          </div>
          <NuxtLink to="/search?sort=newest" class="text-orange hover:text-orange-light font-semibold transition-colors hidden sm:block">
            View All &rarr;
          </NuxtLink>
        </div>
        <div v-if="recentLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 12" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div class="h-48 bg-gray-200" />
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-4 bg-gray-200 rounded w-1/2" />
              <div class="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink
            v-for="listing in recentListings"
            :key="listing.id"
            :to="`/${listing.category.slug}/${listing.slug}`"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
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
              <span class="absolute top-3 right-3 bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">
                {{ listing.condition }}
              </span>
            </div>
            <div class="p-4">
              <p class="text-xs text-gray-500 mb-1">{{ listing.brand.name }} &middot; {{ listing.year }}</p>
              <h3 class="font-semibold text-navy text-sm leading-tight line-clamp-2 mb-2">{{ listing.title }}</h3>
              <p class="text-orange font-bold text-lg">
                {{ listing.currency }} {{ listing.price.toLocaleString() }}
              </p>
              <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ listing.location }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="bg-navy py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Are you a dealer?</h2>
        <p class="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          List your vehicles today and reach thousands of potential buyers across the globe.
        </p>
        <NuxtLink
          to="/register"
          class="inline-block bg-orange hover:bg-orange-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
        >
          Start Selling Today
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { fetchListings } = useListings()

const searchCategory = ref('')
const searchQuery = ref('')

const featuredListings = ref<any[]>([])
const recentListings = ref<any[]>([])
const featuredLoading = ref(true)
const recentLoading = ref(true)

const categories = [
  { name: 'Trucks', slug: 'trucks', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 16H3m10 0h2l3-6h-5' },
  { name: 'Trailers', slug: 'trailers', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 13h18V7H3v6zm0 4h18' },
  { name: 'Vans', slug: 'vans', icon: 'M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0zM14 6H3v11h1m4 0h6m4 0h2V9l-3-3z' },
  { name: 'Equipment', slug: 'equipment', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Parts', slug: 'parts', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
  { name: 'Cars', slug: 'cars', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 11l2-6h14l2 6M3 11h18v6H3v-6z' },
]

const handleSearch = () => {
  const query: Record<string, string> = {}
  if (searchCategory.value) query.category = searchCategory.value
  if (searchQuery.value) query.q = searchQuery.value
  router.push({ path: '/search', query })
}

onMounted(async () => {
  try {
    const featured = await fetchListings({ featured: true, per_page: 8 })
    featuredListings.value = featured.data
  } catch {
    featuredListings.value = []
  } finally {
    featuredLoading.value = false
  }

  try {
    const recent = await fetchListings({ sort: 'newest', per_page: 12 })
    recentListings.value = recent.data
  } catch {
    recentListings.value = []
  } finally {
    recentLoading.value = false
  }
})

useHead({
  title: 'MenonTrucks - Commercial Vehicle Marketplace',
  meta: [
    { name: 'description', content: 'Find your perfect commercial vehicle. Browse thousands of trucks, trailers, equipment, and parts from verified dealers worldwide.' },
  ],
})
</script>
