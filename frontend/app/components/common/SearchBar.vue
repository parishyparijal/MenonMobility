<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  showCategorySelect?: boolean
}>(), {
  placeholder: 'Search vehicles...',
  showCategorySelect: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

const selectedCategory = ref('all')

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'trucks', label: 'Trucks' },
  { value: 'trailers', label: 'Trailers' },
  { value: 'vans', label: 'Vans' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'parts', label: 'Parts' },
]

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function clearInput() {
  emit('update:modelValue', '')
}

function onSearch() {
  emit('search')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    onSearch()
  }
}
</script>

<template>
  <div class="flex items-stretch w-full">
    <!-- Category Dropdown (optional) -->
    <select
      v-if="showCategorySelect"
      v-model="selectedCategory"
      class="hidden sm:block px-4 py-3 text-sm text-[#1E2B47] bg-white border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
      aria-label="Select category"
    >
      <option v-for="cat in categories" :key="cat.value" :value="cat.value">
        {{ cat.label }}
      </option>
    </select>

    <!-- Input Wrapper -->
    <div class="relative flex-1">
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full py-3 pl-10 pr-10 text-sm text-[#1E2B47] bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
        :class="[
          showCategorySelect ? 'sm:border-l-0' : 'rounded-l-lg',
        ]"
        aria-label="Search"
        @input="onInput"
        @keydown="onKeydown"
      />

      <!-- Clear Button -->
      <button
        v-if="modelValue"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Clear search"
        @click="clearInput"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Search Button -->
    <button
      type="button"
      class="px-6 py-3 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#FF8C5E] rounded-r-lg transition-colors duration-200 flex-shrink-0"
      aria-label="Search"
      @click="onSearch"
    >
      Search
    </button>
  </div>
</template>
