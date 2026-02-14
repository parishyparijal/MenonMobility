<script setup lang="ts">
const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'trucks', label: 'Trucks' },
  { value: 'trailers', label: 'Trailers' },
  { value: 'vans', label: 'Vans' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'parts', label: 'Parts' },
]

const popularSearches = [
  { label: 'Mercedes Actros', query: 'Mercedes Actros', category: 'trucks' },
  { label: 'Volvo FH', query: 'Volvo FH', category: 'trucks' },
  { label: 'Used Trucks', query: '', category: 'trucks' },
  { label: 'Scania R-Series', query: 'Scania R', category: 'trucks' },
  { label: 'MAN TGX', query: 'MAN TGX', category: 'trucks' },
]

function onSearch() {
  const params: Record<string, string> = {}
  if (searchQuery.value) params.q = searchQuery.value
  if (selectedCategory.value !== 'all') params.category = selectedCategory.value
  navigateTo({ path: '/search', query: params })
}

function onPopularSearch(search: { query: string; category: string }) {
  navigateTo({
    path: '/search',
    query: {
      q: search.query || undefined,
      category: search.category || undefined,
    },
  })
}
</script>

<template>
  <section class="relative bg-gradient-to-br from-[#1E2B47] to-[#2a3d5f] overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-[#FF6B35] rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
      <div class="text-center max-w-3xl mx-auto">
        <!-- Heading -->
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          Find Your Perfect
          <span class="text-[#FF6B35]">Commercial Vehicle</span>
        </h1>

        <!-- Subheading -->
        <p class="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
          Search over 150,000 trucks, trailers, and equipment from trusted dealers across Europe
        </p>

        <!-- Search Form -->
        <div class="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl mx-auto">
          <!-- Category Dropdown -->
          <select
            v-model="selectedCategory"
            class="hidden sm:block px-4 py-4 text-sm text-[#1E2B47] bg-white border-r border-gray-200 focus:outline-none min-w-[160px]"
            aria-label="Select category"
          >
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>

          <!-- Search Input -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by brand, model, keyword..."
            class="flex-1 px-4 py-4 text-sm text-[#1E2B47] bg-white focus:outline-none"
            aria-label="Search vehicles"
            @keydown.enter="onSearch"
          />

          <!-- Search Button -->
          <button
            type="button"
            class="px-8 py-4 text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#FF8C5E] transition-colors duration-200 flex items-center justify-center"
            aria-label="Search"
            @click="onSearch"
          >
            <svg class="w-5 h-5 mr-2 sm:mr-0 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span class="sm:hidden lg:inline">Search</span>
          </button>
        </div>

        <!-- Popular Searches -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span class="text-gray-400 text-sm">Popular:</span>
          <button
            v-for="search in popularSearches"
            :key="search.label"
            type="button"
            class="text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors duration-200"
            @click="onPopularSearch(search)"
          >
            {{ search.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
