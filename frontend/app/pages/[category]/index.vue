<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Category Header -->
    <div class="bg-navy text-white py-12">
      <div class="container mx-auto px-4">
        <nav class="text-sm text-gray-400 mb-4">
          <NuxtLink to="/" class="hover:text-orange transition-colors">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-white">{{ categoryInfo?.name || route.params.category }}</span>
        </nav>
        <h1 class="text-3xl md:text-4xl font-bold mb-2 capitalize">{{ categoryInfo?.name || route.params.category }}</h1>
        <p class="text-gray-300 max-w-2xl">{{ categoryInfo?.description || `Browse our selection of ${route.params.category} from verified sellers worldwide.` }}</p>
        <p class="text-gray-400 mt-3 text-sm">{{ total }} listings found</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Subcategory Chips -->
      <div v-if="subcategories.length" class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="sub in subcategories"
          :key="sub.slug"
          @click="selectSubcategory(sub.slug)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedSubcategory === sub.slug
              ? 'bg-orange text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-orange hover:text-orange',
          ]"
        >
          {{ sub.name }}
        </button>
      </div>

      <div class="flex gap-8">
        <!-- Filter Sidebar -->
        <aside class="hidden lg:block w-72 flex-shrink-0">
          <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-navy text-lg">Filters</h3>
              <button @click="clearFilters" class="text-sm text-orange hover:text-orange-light transition-colors">
                Clear All
              </button>
            </div>

            <!-- Brand -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Brand</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label v-for="brand in aggregations?.brands || []" :key="brand.name" class="flex items-center justify-between cursor-pointer group">
                  <div class="flex items-center gap-2">
                    <input type="radio" :value="brand.name" v-model="filters.brand" class="text-orange focus:ring-orange" />
                    <span class="text-sm text-gray-700 group-hover:text-navy transition-colors">{{ brand.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400">({{ brand.count }})</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Price Range</h4>
              <div class="flex gap-2">
                <input v-model.number="filters.minPrice" type="number" placeholder="Min" class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none" />
                <input v-model.number="filters.maxPrice" type="number" placeholder="Max" class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none" />
              </div>
            </div>

            <!-- Year Range -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Year</h4>
              <div class="flex gap-2">
                <input v-model.number="filters.minYear" type="number" placeholder="From" class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none" />
                <input v-model.number="filters.maxYear" type="number" placeholder="To" class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none" />
              </div>
            </div>

            <!-- Condition -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Condition</h4>
              <div class="space-y-2">
                <label v-for="cond in aggregations?.conditions || []" :key="cond.name" class="flex items-center justify-between cursor-pointer group">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" :checked="filters.condition === cond.name" @change="filters.condition = filters.condition === cond.name ? '' : cond.name" class="text-orange focus:ring-orange rounded" />
                    <span class="text-sm text-gray-700 capitalize">{{ cond.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400">({{ cond.count }})</span>
                </label>
              </div>
            </div>

            <!-- Fuel Type -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Fuel Type</h4>
              <div class="space-y-2">
                <label v-for="fuel in aggregations?.fuel_types || []" :key="fuel.name" class="flex items-center justify-between cursor-pointer group">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" :checked="filters.fuelType === fuel.name" @change="filters.fuelType = filters.fuelType === fuel.name ? '' : fuel.name" class="text-orange focus:ring-orange rounded" />
                    <span class="text-sm text-gray-700 capitalize">{{ fuel.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400">({{ fuel.count }})</span>
                </label>
              </div>
            </div>

            <!-- Country -->
            <div>
              <h4 class="font-semibold text-navy text-sm mb-3">Country</h4>
              <select v-model="filters.country" class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none">
                <option value="">All Countries</option>
                <option v-for="c in aggregations?.countries || []" :key="c.name" :value="c.name">{{ c.name }} ({{ c.count }})</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="flex-1 min-w-0">
          <!-- Sort -->
          <div class="flex items-center justify-between mb-6">
            <p class="text-gray-600 text-sm">
              <span class="font-semibold text-navy">{{ total }}</span> listings
            </p>
            <select v-model="filters.sort" class="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-navy focus:border-orange outline-none">
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="year_desc">Year: Newest</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 9" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div class="h-48 bg-gray-200" />
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4" />
                <div class="h-4 bg-gray-200 rounded w-1/2" />
                <div class="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!results.length" class="text-center py-20">
            <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-navy mb-2">No listings found</h3>
            <p class="text-gray-500">Try adjusting your filters</p>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <NuxtLink
              v-for="listing in results"
              :key="listing.id"
              :to="`/${route.params.category}/${listing.slug}`"
              class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div class="relative h-48 bg-gray-100 overflow-hidden">
                <img v-if="listing.images.length" :src="listing.images[0].thumbnail" :alt="listing.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span class="absolute top-3 right-3 bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">{{ listing.condition }}</span>
              </div>
              <div class="p-4">
                <p class="text-xs text-gray-500 mb-1">{{ listing.brand }} &middot; {{ listing.year }}</p>
                <h3 class="font-semibold text-navy text-sm leading-tight line-clamp-2 mb-2">{{ listing.title }}</h3>
                <p class="text-orange font-bold text-lg">{{ listing.currency }} {{ listing.price.toLocaleString() }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ listing.location }}</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-10">
            <button @click="filters.page = Math.max(1, filters.page - 1)" :disabled="filters.page === 1" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:border-orange hover:text-orange transition-colors">Previous</button>
            <template v-for="page in paginationRange" :key="page">
              <button v-if="page !== '...'" @click="filters.page = Number(page)" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', filters.page === Number(page) ? 'bg-orange text-white' : 'border border-gray-200 hover:border-orange hover:text-orange']">{{ page }}</button>
              <span v-else class="px-2 text-gray-400">...</span>
            </template>
            <button @click="filters.page = Math.min(lastPage, filters.page + 1)" :disabled="filters.page === lastPage" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:border-orange hover:text-orange transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $api } = useNuxtApp()
const { filters, results, aggregations, total, lastPage, isLoading, search, clearFilters } = useSearch()

const categoryInfo = ref<{ name: string; description: string; slug: string } | null>(null)
const subcategories = ref<{ name: string; slug: string }[]>([])
const selectedSubcategory = ref('')

// Fetch category info via SSR
const { data: catData } = await useAsyncData(`category-${route.params.category}`, async () => {
  try {
    return await $api<{ data: { name: string; description: string; slug: string; subcategories: { name: string; slug: string }[] } }>(`/categories/${route.params.category}`)
  } catch {
    return null
  }
})

if (catData.value) {
  categoryInfo.value = catData.value.data
  subcategories.value = catData.value.data.subcategories || []
}

// Set category filter and search
onMounted(() => {
  filters.value.category = String(route.params.category)
  search()
})

const selectSubcategory = (slug: string) => {
  selectedSubcategory.value = selectedSubcategory.value === slug ? '' : slug
  filters.value.category = selectedSubcategory.value || String(route.params.category)
}

const paginationRange = computed(() => {
  const pages: (number | string)[] = []
  const current = filters.value.page
  const last = lastPage.value
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i)
    if (current < last - 2) pages.push('...')
    pages.push(last)
  }
  return pages
})

useHead({
  title: computed(() => `${categoryInfo.value?.name || String(route.params.category)} - MenonTrucks`),
  meta: [
    { name: 'description', content: computed(() => categoryInfo.value?.description || `Browse ${route.params.category} listings on MenonTrucks`) as unknown as string },
  ],
})
</script>
