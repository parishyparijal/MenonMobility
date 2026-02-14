<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const perPage = computed(() => {
  if (props.totalPages <= 0) return props.totalItems
  return Math.ceil(props.totalItems / props.totalPages)
})

const showingFrom = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * perPage.value + 1
})

const showingTo = computed(() => {
  return Math.min(props.currentPage * perPage.value, props.totalItems)
})

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const items: Array<number | 'ellipsis'> = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      items.push(i)
    }
    return items
  }

  // Always show first page
  items.push(1)

  if (current > 3) {
    items.push('ellipsis')
  }

  // Show pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (current < total - 2) {
    items.push('ellipsis')
  }

  // Always show last page
  if (total > 1) {
    items.push(total)
  }

  return items
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Results Info -->
    <p class="text-sm text-gray-500">
      Showing <span class="font-medium text-[#1E2B47]">{{ showingFrom }}</span>-<span class="font-medium text-[#1E2B47]">{{ showingTo }}</span>
      of <span class="font-medium text-[#1E2B47]">{{ totalItems }}</span> results
    </p>

    <!-- Page Buttons -->
    <nav class="flex items-center space-x-1" aria-label="Pagination">
      <!-- Previous -->
      <button
        type="button"
        class="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="currentPage === 1
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-[#1E2B47] hover:bg-gray-100'"
        :disabled="currentPage === 1"
        aria-label="Previous page"
        @click="goToPage(currentPage - 1)"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page Numbers -->
      <template v-for="(page, index) in pages" :key="index">
        <span
          v-if="page === 'ellipsis'"
          class="px-3 py-2 text-sm text-gray-400"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          class="min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="page === currentPage
            ? 'bg-[#FF6B35] text-white'
            : 'text-[#1E2B47] hover:bg-gray-100'"
          :aria-label="`Page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        type="button"
        class="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="currentPage === totalPages
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-[#1E2B47] hover:bg-gray-100'"
        :disabled="currentPage === totalPages"
        aria-label="Next page"
        @click="goToPage(currentPage + 1)"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  </div>
</template>
