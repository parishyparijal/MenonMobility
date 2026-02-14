<script setup lang="ts">
interface FilterValues {
  categories?: string[]
  brands?: string[]
  price_min?: number | null
  price_max?: number | null
  year_min?: number | null
  year_max?: number | null
  conditions?: string[]
  fuel_types?: string[]
  country?: string | null
}

interface AggregationBucket {
  key: string
  doc_count: number
}

interface Aggregations {
  categories?: AggregationBucket[]
  brands?: AggregationBucket[]
  fuel_types?: AggregationBucket[]
  conditions?: AggregationBucket[]
  countries?: AggregationBucket[]
}

const props = defineProps<{
  filters: FilterValues
  aggregations?: Aggregations
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: FilterValues): void
}>()

// Section collapse state
const sections = reactive({
  category: true,
  brand: true,
  price: true,
  year: true,
  condition: true,
  fuel_type: true,
  country: false,
})

// Brand search
const brandSearch = ref('')

const filteredBrands = computed(() => {
  const brands = props.aggregations?.brands || []
  if (!brandSearch.value) return brands
  return brands.filter((b) =>
    b.key.toLowerCase().includes(brandSearch.value.toLowerCase())
  )
})

// Local price/year inputs
const priceMin = ref<string>(props.filters.price_min?.toString() || '')
const priceMax = ref<string>(props.filters.price_max?.toString() || '')
const yearMin = ref<string>(props.filters.year_min?.toString() || '')
const yearMax = ref<string>(props.filters.year_max?.toString() || '')

const hasActiveFilters = computed(() => {
  const f = props.filters
  return (
    (f.categories && f.categories.length > 0) ||
    (f.brands && f.brands.length > 0) ||
    f.price_min != null ||
    f.price_max != null ||
    f.year_min != null ||
    f.year_max != null ||
    (f.conditions && f.conditions.length > 0) ||
    (f.fuel_types && f.fuel_types.length > 0) ||
    f.country != null
  )
})

function toggleSection(section: keyof typeof sections) {
  sections[section] = !sections[section]
}

function updateFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
  emit('update:filters', { ...props.filters, [key]: value })
}

function toggleArrayFilter(key: 'categories' | 'brands' | 'conditions' | 'fuel_types', value: string) {
  const current = (props.filters[key] || []) as string[]
  const updated = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
  updateFilter(key, updated)
}

function applyPriceRange() {
  updateFilter('price_min', priceMin.value ? Number(priceMin.value) : null)
  updateFilter('price_max', priceMax.value ? Number(priceMax.value) : null)
}

function applyYearRange() {
  updateFilter('year_min', yearMin.value ? Number(yearMin.value) : null)
  updateFilter('year_max', yearMax.value ? Number(yearMax.value) : null)
}

function clearAllFilters() {
  priceMin.value = ''
  priceMax.value = ''
  yearMin.value = ''
  yearMax.value = ''
  brandSearch.value = ''
  emit('update:filters', {
    categories: [],
    brands: [],
    price_min: null,
    price_max: null,
    year_min: null,
    year_max: null,
    conditions: [],
    fuel_types: [],
    country: null,
  })
}
</script>

<template>
  <aside class="space-y-1">
    <!-- Clear All -->
    <div v-if="hasActiveFilters" class="pb-3 border-b border-gray-200">
      <button
        type="button"
        class="text-sm text-[#FF6B35] hover:text-[#FF8C5E] font-medium transition-colors duration-200"
        @click="clearAllFilters"
      >
        Clear All Filters
      </button>
    </div>

    <!-- Category Section -->
    <div class="border-b border-gray-200 py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('category')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Category</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.category }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.category" class="mt-3 space-y-2">
        <label
          v-for="cat in (aggregations?.categories || [])"
          :key="cat.key"
          class="flex items-center text-sm cursor-pointer group"
        >
          <input
            type="checkbox"
            :checked="(filters.categories || []).includes(cat.key)"
            class="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
            @change="toggleArrayFilter('categories', cat.key)"
          />
          <span class="ml-2 text-gray-700 group-hover:text-[#1E2B47]">{{ cat.key }}</span>
          <span class="ml-auto text-xs text-gray-400">({{ cat.doc_count }})</span>
        </label>
      </div>
    </div>

    <!-- Brand Section -->
    <div class="border-b border-gray-200 py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('brand')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Brand</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.brand }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.brand" class="mt-3 space-y-2">
        <input
          v-model="brandSearch"
          type="text"
          placeholder="Search brands..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
        />
        <div class="max-h-48 overflow-y-auto space-y-2">
          <label
            v-for="brand in filteredBrands"
            :key="brand.key"
            class="flex items-center text-sm cursor-pointer group"
          >
            <input
              type="checkbox"
              :checked="(filters.brands || []).includes(brand.key)"
              class="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
              @change="toggleArrayFilter('brands', brand.key)"
            />
            <span class="ml-2 text-gray-700 group-hover:text-[#1E2B47]">{{ brand.key }}</span>
            <span class="ml-auto text-xs text-gray-400">({{ brand.doc_count }})</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Price Range Section -->
    <div class="border-b border-gray-200 py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('price')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Price Range</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.price }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.price" class="mt-3">
        <div class="flex items-center space-x-2">
          <input
            v-model="priceMin"
            type="number"
            placeholder="Min"
            min="0"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
          <span class="text-gray-400">-</span>
          <input
            v-model="priceMax"
            type="number"
            placeholder="Max"
            min="0"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
        </div>
        <button
          type="button"
          class="mt-2 w-full px-3 py-2 text-sm font-medium text-[#FF6B35] border border-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors duration-200"
          @click="applyPriceRange"
        >
          Apply
        </button>
      </div>
    </div>

    <!-- Year Range Section -->
    <div class="border-b border-gray-200 py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('year')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Year</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.year }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.year" class="mt-3">
        <div class="flex items-center space-x-2">
          <input
            v-model="yearMin"
            type="number"
            placeholder="From"
            min="1950"
            max="2030"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
          <span class="text-gray-400">-</span>
          <input
            v-model="yearMax"
            type="number"
            placeholder="To"
            min="1950"
            max="2030"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
        </div>
        <button
          type="button"
          class="mt-2 w-full px-3 py-2 text-sm font-medium text-[#FF6B35] border border-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors duration-200"
          @click="applyYearRange"
        >
          Apply
        </button>
      </div>
    </div>

    <!-- Condition Section -->
    <div class="border-b border-gray-200 py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('condition')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Condition</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.condition }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.condition" class="mt-3 space-y-2">
        <label
          v-for="cond in ['New', 'Used']"
          :key="cond"
          class="flex items-center text-sm cursor-pointer group"
        >
          <input
            type="checkbox"
            :checked="(filters.conditions || []).includes(cond)"
            class="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
            @change="toggleArrayFilter('conditions', cond)"
          />
          <span class="ml-2 text-gray-700 group-hover:text-[#1E2B47]">{{ cond }}</span>
        </label>
      </div>
    </div>

    <!-- Fuel Type Section -->
    <div class="border-b border-gray-200 py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('fuel_type')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Fuel Type</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.fuel_type }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.fuel_type" class="mt-3 space-y-2">
        <label
          v-for="fuel in (aggregations?.fuel_types || [])"
          :key="fuel.key"
          class="flex items-center text-sm cursor-pointer group"
        >
          <input
            type="checkbox"
            :checked="(filters.fuel_types || []).includes(fuel.key)"
            class="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
            @change="toggleArrayFilter('fuel_types', fuel.key)"
          />
          <span class="ml-2 text-gray-700 group-hover:text-[#1E2B47]">{{ fuel.key }}</span>
          <span class="ml-auto text-xs text-gray-400">({{ fuel.doc_count }})</span>
        </label>
      </div>
    </div>

    <!-- Country Section -->
    <div class="py-4">
      <button
        type="button"
        class="flex items-center justify-between w-full text-left"
        @click="toggleSection('country')"
      >
        <span class="text-sm font-semibold text-[#1E2B47]">Country</span>
        <svg
          class="w-4 h-4 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': sections.country }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="sections.country" class="mt-3">
        <select
          :value="filters.country || ''"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          @change="updateFilter('country', ($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">All Countries</option>
          <option
            v-for="c in (aggregations?.countries || [])"
            :key="c.key"
            :value="c.key"
          >
            {{ c.key }} ({{ c.doc_count }})
          </option>
        </select>
      </div>
    </div>
  </aside>
</template>
