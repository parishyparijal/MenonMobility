<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'year_desc', label: 'Year: Newest' },
  { value: 'mileage_asc', label: 'Mileage: Lowest' },
]

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <label for="sort-select" class="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
    <select
      id="sort-select"
      :value="modelValue"
      class="px-3 py-2 text-sm text-[#1E2B47] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent cursor-pointer"
      @change="onChange"
    >
      <option
        v-for="option in sortOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
