<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  actionText?: string
  actionTo?: string
}>(), {
  icon: '',
  description: '',
  actionText: '',
  actionTo: '',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <!-- Icon Area -->
    <div class="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
      <svg
        v-if="!icon"
        class="w-10 h-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <span v-else class="text-3xl text-gray-400">{{ icon }}</span>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-[#1E2B47] mb-2">{{ title }}</h3>

    <!-- Description -->
    <p v-if="description" class="text-gray-500 text-sm max-w-md mb-6">{{ description }}</p>

    <!-- Action Button -->
    <NuxtLink
      v-if="actionText && actionTo"
      :to="actionTo"
      class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#FF8C5E] rounded-lg transition-colors duration-200"
    >
      {{ actionText }}
    </NuxtLink>
  </div>
</template>
