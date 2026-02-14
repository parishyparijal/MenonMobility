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

const props = defineProps<{
  filters: FilterValues
}>()

const emit = defineEmits<{
  (e: 'remove', key: string, value?: string): void
  (e: 'clear-all'): void
}>()

interface FilterChip {
  key: string
  label: string
  value?: string
}

const activeChips = computed<FilterChip[]>(() => {
  const chips: FilterChip[] = []
  const f = props.filters

  if (f.categories) {
    f.categories.forEach((cat) => {
      chips.push({ key: 'categories', label: `Category: ${cat}`, value: cat })
    })
  }

  if (f.brands) {
    f.brands.forEach((brand) => {
      chips.push({ key: 'brands', label: `Brand: ${brand}`, value: brand })
    })
  }

  if (f.price_min != null || f.price_max != null) {
    const min = f.price_min != null ? `$${f.price_min.toLocaleString()}` : '...'
    const max = f.price_max != null ? `$${f.price_max.toLocaleString()}` : '...'
    chips.push({ key: 'price', label: `Price: ${min} - ${max}` })
  }

  if (f.year_min != null || f.year_max != null) {
    const min = f.year_min ?? '...'
    const max = f.year_max ?? '...'
    chips.push({ key: 'year', label: `Year: ${min} - ${max}` })
  }

  if (f.conditions) {
    f.conditions.forEach((cond) => {
      chips.push({ key: 'conditions', label: `Condition: ${cond}`, value: cond })
    })
  }

  if (f.fuel_types) {
    f.fuel_types.forEach((fuel) => {
      chips.push({ key: 'fuel_types', label: `Fuel: ${fuel}`, value: fuel })
    })
  }

  if (f.country) {
    chips.push({ key: 'country', label: `Country: ${f.country}` })
  }

  return chips
})

function removeChip(chip: FilterChip) {
  emit('remove', chip.key, chip.value)
}

function clearAll() {
  emit('clear-all')
}
</script>

<template>
  <div v-if="activeChips.length > 0" class="flex flex-wrap items-center gap-2">
    <span
      v-for="chip in activeChips"
      :key="`${chip.key}-${chip.value}`"
      class="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-[#1E2B47] rounded-full"
    >
      {{ chip.label }}
      <button
        type="button"
        class="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        :aria-label="`Remove filter: ${chip.label}`"
        @click="removeChip(chip)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>

    <button
      type="button"
      class="text-sm text-[#FF6B35] hover:text-[#FF8C5E] font-medium transition-colors duration-200"
      @click="clearAll"
    >
      Clear All
    </button>
  </div>
</template>
