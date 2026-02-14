<script setup lang="ts">
interface ListingSpecData {
  brand_name?: string | null
  model?: string | null
  year?: number | null
  condition?: string | null
  fuel_type?: string | null
  power_hp?: number | null
  transmission?: string | null
  emission_class?: string | null
  gvw_kg?: number | null
  payload_kg?: number | null
  axles?: number | null
  wheelbase_mm?: number | null
  color?: string | null
  vin?: string | null
  [key: string]: unknown
}

const props = defineProps<{
  listing: ListingSpecData
}>()

interface SpecItem {
  label: string
  value: string
}

interface SpecGroup {
  title: string
  items: SpecItem[]
}

function formatNumber(val: number): string {
  return new Intl.NumberFormat('en').format(val)
}

const specGroups = computed<SpecGroup[]>(() => {
  const l = props.listing
  const groups: SpecGroup[] = []

  // General
  const general: SpecItem[] = []
  if (l.brand_name) general.push({ label: 'Brand', value: l.brand_name })
  if (l.model) general.push({ label: 'Model', value: l.model })
  if (l.year) general.push({ label: 'Year', value: String(l.year) })
  if (l.condition) general.push({ label: 'Condition', value: l.condition })
  if (general.length) groups.push({ title: 'General', items: general })

  // Engine
  const engine: SpecItem[] = []
  if (l.fuel_type) engine.push({ label: 'Fuel Type', value: l.fuel_type })
  if (l.power_hp) engine.push({ label: 'Power', value: `${formatNumber(l.power_hp)} HP` })
  if (l.transmission) engine.push({ label: 'Transmission', value: l.transmission })
  if (l.emission_class) engine.push({ label: 'Emission Class', value: l.emission_class })
  if (engine.length) groups.push({ title: 'Engine', items: engine })

  // Dimensions
  const dimensions: SpecItem[] = []
  if (l.gvw_kg) dimensions.push({ label: 'Gross Vehicle Weight', value: `${formatNumber(l.gvw_kg)} kg` })
  if (l.payload_kg) dimensions.push({ label: 'Payload', value: `${formatNumber(l.payload_kg)} kg` })
  if (l.axles) dimensions.push({ label: 'Axles', value: String(l.axles) })
  if (l.wheelbase_mm) dimensions.push({ label: 'Wheelbase', value: `${formatNumber(l.wheelbase_mm)} mm` })
  if (dimensions.length) groups.push({ title: 'Dimensions', items: dimensions })

  // Additional
  const additional: SpecItem[] = []
  if (l.color) additional.push({ label: 'Color', value: l.color })
  if (l.vin) additional.push({ label: 'VIN', value: l.vin })
  if (additional.length) groups.push({ title: 'Additional', items: additional })

  return groups
})
</script>

<template>
  <div v-if="specGroups.length > 0" class="space-y-6">
    <div v-for="group in specGroups" :key="group.title">
      <h3 class="text-lg font-semibold text-[#1E2B47] mb-3">{{ group.title }}</h3>
      <div class="rounded-lg border border-gray-200 overflow-hidden">
        <div
          v-for="(item, index) in group.items"
          :key="item.label"
          class="flex items-center px-4 py-3 text-sm"
          :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
        >
          <span class="w-1/2 text-gray-500 font-medium">{{ item.label }}</span>
          <span class="w-1/2 text-[#1E2B47]">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
