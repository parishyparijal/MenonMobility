<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-orange transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-navy font-medium">Search Results</span>
      </nav>

      <div class="flex gap-8">
        <!-- Filter Sidebar (Desktop) -->
        <aside class="hidden lg:block w-72 flex-shrink-0">
          <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-navy text-lg">Filters</h3>
              <button @click="clearFilters" class="text-sm text-orange hover:text-orange-light transition-colors">
                Clear All
              </button>
            </div>

            <!-- Category -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Category</h4>
              <div class="space-y-2">
                <label
                  v-for="cat in aggregations?.categories || []"
                  :key="cat.name"
                  class="flex items-center justify-between cursor-pointer group"
                >
                  <div class="flex items-center gap-2">
                    <input
                      type="radio"
                      :value="cat.name"
                      v-model="filters.category"
                      class="text-orange focus:ring-orange"
                    />
                    <span class="text-sm text-gray-700 group-hover:text-navy transition-colors">{{ cat.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400">({{ cat.count }})</span>
                </label>
              </div>
            </div>

            <!-- Brand -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Brand</h4>
              <input
                v-model="brandSearch"
                type="text"
                placeholder="Search brand..."
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none mb-2"
              />
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <label
                  v-for="brand in filteredBrands"
                  :key="brand.name"
                  class="flex items-center justify-between cursor-pointer group"
                >
                  <div class="flex items-center gap-2">
                    <input
                      type="radio"
                      :value="brand.name"
                      v-model="filters.brand"
                      class="text-orange focus:ring-orange"
                    />
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
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  placeholder="Min"
                  class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none"
                />
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="Max"
                  class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none"
                />
              </div>
            </div>

            <!-- Year Range -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Year Range</h4>
              <div class="flex gap-2">
                <input
                  v-model.number="filters.minYear"
                  type="number"
                  placeholder="From"
                  class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none"
                />
                <input
                  v-model.number="filters.maxYear"
                  type="number"
                  placeholder="To"
                  class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none"
                />
              </div>
            </div>

            <!-- Condition -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Condition</h4>
              <div class="space-y-2">
                <label
                  v-for="cond in aggregations?.conditions || []"
                  :key="cond.name"
                  class="flex items-center justify-between cursor-pointer group"
                >
                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      :value="cond.name"
                      @change="toggleCondition(cond.name)"
                      :checked="filters.condition === cond.name"
                      class="text-orange focus:ring-orange rounded"
                    />
                    <span class="text-sm text-gray-700 group-hover:text-navy transition-colors capitalize">{{ cond.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400">({{ cond.count }})</span>
                </label>
              </div>
            </div>

            <!-- Fuel Type -->
            <div class="mb-6">
              <h4 class="font-semibold text-navy text-sm mb-3">Fuel Type</h4>
              <div class="space-y-2">
                <label
                  v-for="fuel in aggregations?.fuel_types || []"
                  :key="fuel.name"
                  class="flex items-center justify-between cursor-pointer group"
                >
                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      :value="fuel.name"
                      @change="toggleFuelType(fuel.name)"
                      :checked="filters.fuelType === fuel.name"
                      class="text-orange focus:ring-orange rounded"
                    />
                    <span class="text-sm text-gray-700 group-hover:text-navy transition-colors capitalize">{{ fuel.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400">({{ fuel.count }})</span>
                </label>
              </div>
            </div>

            <!-- Country -->
            <div>
              <h4 class="font-semibold text-navy text-sm mb-3">Country</h4>
              <select
                v-model="filters.country"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none"
              >
                <option value="">All Countries</option>
                <option v-for="country in aggregations?.countries || []" :key="country.name" :value="country.name">
                  {{ country.name }} ({{ country.count }})
                </option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Mobile Filter Button -->
        <button
          @click="showMobileFilter = true"
          class="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-navy text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>

        <!-- Mobile Filter Drawer -->
        <Teleport to="body">
          <div v-if="showMobileFilter" class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/50" @click="showMobileFilter = false" />
            <div class="absolute inset-y-0 left-0 w-80 max-w-full bg-white overflow-y-auto">
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="font-bold text-navy text-lg">Filters</h3>
                  <button @click="showMobileFilter = false" class="text-gray-400 hover:text-navy">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button @click="clearFilters(); showMobileFilter = false" class="text-sm text-orange hover:text-orange-light mb-4 transition-colors">
                  Clear All Filters
                </button>

                <!-- Category -->
                <div class="mb-6">
                  <h4 class="font-semibold text-navy text-sm mb-3">Category</h4>
                  <div class="space-y-2">
                    <label v-for="cat in aggregations?.categories || []" :key="cat.name" class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" :value="cat.name" v-model="filters.category" class="text-orange focus:ring-orange" />
                      <span class="text-sm text-gray-700">{{ cat.name }} ({{ cat.count }})</span>
                    </label>
                  </div>
                </div>

                <!-- Brand -->
                <div class="mb-6">
                  <h4 class="font-semibold text-navy text-sm mb-3">Brand</h4>
                  <div class="space-y-2 max-h-40 overflow-y-auto">
                    <label v-for="brand in aggregations?.brands || []" :key="brand.name" class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" :value="brand.name" v-model="filters.brand" class="text-orange focus:ring-orange" />
                      <span class="text-sm text-gray-700">{{ brand.name }} ({{ brand.count }})</span>
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
                  <h4 class="font-semibold text-navy text-sm mb-3">Year Range</h4>
                  <div class="flex gap-2">
                    <input v-model.number="filters.minYear" type="number" placeholder="From" class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none" />
                    <input v-model.number="filters.maxYear" type="number" placeholder="To" class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none" />
                  </div>
                </div>

                <!-- Condition -->
                <div class="mb-6">
                  <h4 class="font-semibold text-navy text-sm mb-3">Condition</h4>
                  <div class="space-y-2">
                    <label v-for="cond in aggregations?.conditions || []" :key="cond.name" class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" :checked="filters.condition === cond.name" @change="toggleCondition(cond.name)" class="text-orange focus:ring-orange rounded" />
                      <span class="text-sm text-gray-700 capitalize">{{ cond.name }}</span>
                    </label>
                  </div>
                </div>

                <button
                  @click="showMobileFilter = false"
                  class="w-full bg-orange hover:bg-orange-light text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Show {{ total }} Results
                </button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Results Area -->
        <div class="flex-1 min-w-0">
          <!-- Top Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p class="text-gray-600">
              <span class="font-semibold text-navy">{{ total }}</span> results found
              <span v-if="filters.query"> for "<span class="font-semibold text-navy">{{ filters.query }}</span>"</span>
            </p>
            <select
              v-model="filters.sort"
              class="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-navy focus:border-orange focus:ring-1 focus:ring-orange/20 outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="year_desc">Year: Newest First</option>
            </select>
          </div>

          <!-- Loading State -->
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

          <!-- Empty State -->
          <div v-else-if="!results.length" class="text-center py-20">
            <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-navy mb-2">No listings found</h3>
            <p class="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button @click="clearFilters" class="bg-orange hover:bg-orange-light text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Clear Filters
            </button>
          </div>

          <!-- Results Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <NuxtLink
              v-for="listing in results"
              :key="listing.id"
              :to="`/${listing.category}/${listing.slug}`"
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
                <div class="absolute top-3 right-3 flex gap-2">
                  <span class="bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">{{ listing.condition }}</span>
                </div>
                <div v-if="listing.seller.verified" class="absolute top-3 left-3">
                  <span class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    Verified
                  </span>
                </div>
              </div>
              <div class="p-4">
                <p class="text-xs text-gray-500 mb-1">{{ listing.brand }} &middot; {{ listing.year }}</p>
                <h3 class="font-semibold text-navy text-sm leading-tight line-clamp-2 mb-2">{{ listing.title }}</h3>
                <p class="text-orange font-bold text-lg">
                  {{ listing.currency }} {{ listing.price.toLocaleString() }}
                </p>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-xs text-gray-400 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ listing.location }}
                  </p>
                  <p class="text-xs text-gray-400">{{ listing.seller.company || listing.seller.name }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-10">
            <button
              @click="filters.page = Math.max(1, filters.page - 1)"
              :disabled="filters.page === 1"
              class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-orange hover:text-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <template v-for="page in paginationPages" :key="page">
              <button
                v-if="page !== '...'"
                @click="filters.page = Number(page)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filters.page === Number(page)
                    ? 'bg-orange text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-orange hover:text-orange',
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 text-gray-400">...</span>
            </template>
            <button
              @click="filters.page = Math.min(lastPage, filters.page + 1)"
              :disabled="filters.page === lastPage"
              class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-orange hover:text-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { filters, results, aggregations, total, lastPage, isLoading, search, clearFilters } = useSearch()

const showMobileFilter = ref(false)
const brandSearch = ref('')

// Populate filters from query params on mount
onMounted(() => {
  const q = route.query
  if (q.q) filters.value.query = String(q.q)
  if (q.category) filters.value.category = String(q.category)
  if (q.brand) filters.value.brand = String(q.brand)
  if (q.condition) filters.value.condition = String(q.condition)
  if (q.min_price) filters.value.minPrice = Number(q.min_price)
  if (q.max_price) filters.value.maxPrice = Number(q.max_price)
  if (q.min_year) filters.value.minYear = Number(q.min_year)
  if (q.max_year) filters.value.maxYear = Number(q.max_year)
  if (q.sort) filters.value.sort = String(q.sort)
  if (q.page) filters.value.page = Number(q.page)

  search()
})

// Watch route query changes
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.q && newQuery.q !== filters.value.query) {
      filters.value.query = String(newQuery.q)
    }
  },
)

const filteredBrands = computed(() => {
  const brands = aggregations.value?.brands || []
  if (!brandSearch.value) return brands
  return brands.filter((b) => b.name.toLowerCase().includes(brandSearch.value.toLowerCase()))
})

const toggleCondition = (condition: string) => {
  filters.value.condition = filters.value.condition === condition ? '' : condition
}

const toggleFuelType = (fuel: string) => {
  filters.value.fuelType = filters.value.fuelType === fuel ? '' : fuel
}

const paginationPages = computed(() => {
  const pages: (number | string)[] = []
  const current = filters.value.page
  const last = lastPage.value

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < last - 2) pages.push('...')
    pages.push(last)
  }

  return pages
})

useHead({
  title: computed(() => {
    const parts = ['Search']
    if (filters.value.query) parts.push(`"${filters.value.query}"`)
    parts.push('- MenonTrucks')
    return parts.join(' ')
  }),
})
</script>
