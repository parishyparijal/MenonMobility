<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="flex items-center text-sm" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-1 flex-wrap">
      <!-- Home Link -->
      <li class="flex items-center">
        <NuxtLink
          to="/"
          class="text-gray-500 hover:text-[#FF6B35] transition-colors duration-200"
          aria-label="Home"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </NuxtLink>
      </li>

      <template v-for="(item, index) in items" :key="index">
        <!-- Separator -->
        <li class="flex items-center" aria-hidden="true">
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>

        <!-- Link or Current Page -->
        <li class="flex items-center">
          <NuxtLink
            v-if="item.to && index < items.length - 1"
            :to="item.to"
            class="text-gray-500 hover:text-[#FF6B35] transition-colors duration-200 whitespace-nowrap"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            class="text-[#1E2B47] font-medium truncate max-w-[200px] sm:max-w-xs"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>
