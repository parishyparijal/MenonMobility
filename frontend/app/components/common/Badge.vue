<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'sm' | 'md'
}>(), {
  variant: 'default',
  size: 'md',
})

const variantClasses: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}
</script>

<template>
  <span
    class="inline-flex items-center font-medium rounded-full"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </span>
</template>
