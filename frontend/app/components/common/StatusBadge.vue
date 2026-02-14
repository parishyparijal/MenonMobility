<script setup lang="ts">
defineProps<{
  status: 'draft' | 'pending_review' | 'active' | 'sold' | 'expired' | 'rejected'
}>()

const statusConfig: Record<string, { label: string; classes: string }> = {
  draft: {
    label: 'Draft',
    classes: 'bg-gray-100 text-gray-800',
  },
  pending_review: {
    label: 'Pending Review',
    classes: 'bg-yellow-100 text-yellow-800',
  },
  active: {
    label: 'Active',
    classes: 'bg-green-100 text-green-800',
  },
  sold: {
    label: 'Sold',
    classes: 'bg-blue-100 text-blue-800',
  },
  expired: {
    label: 'Expired',
    classes: 'bg-orange-100 text-orange-800',
  },
  rejected: {
    label: 'Rejected',
    classes: 'bg-red-100 text-red-800',
  },
}
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
    :class="statusConfig[status]?.classes || 'bg-gray-100 text-gray-800'"
  >
    {{ statusConfig[status]?.label || status }}
  </span>
</template>
