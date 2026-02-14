<script setup lang="ts">
interface Category {
  id: number | string
  name: string
  slug: string
  listing_count: number
  icon?: string
}

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/${category.slug}`"
      class="group bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
    >
      <!-- Icon Placeholder -->
      <div
        class="w-14 h-14 mx-auto mb-3 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center group-hover:bg-[#FF6B35]/20 transition-colors duration-300"
      >
        <span v-if="category.icon" class="text-2xl">{{ category.icon }}</span>
        <span v-else class="text-xl font-bold text-[#FF6B35]">
          {{ category.name.charAt(0) }}
        </span>
      </div>

      <!-- Category Name -->
      <h3 class="text-sm font-semibold text-[#1E2B47] group-hover:text-[#FF6B35] transition-colors duration-200 mb-1">
        {{ category.name }}
      </h3>

      <!-- Listing Count -->
      <p class="text-xs text-gray-400">
        {{ category.listing_count.toLocaleString() }} listings
      </p>
    </NuxtLink>
  </div>
</template>
