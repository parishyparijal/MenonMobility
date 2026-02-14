<script setup lang="ts">
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <!-- Image Skeleton -->
    <div class="aspect-[4/3] bg-gray-200 rounded-t-xl" />

    <!-- Content Skeleton -->
    <div class="p-4 space-y-3">
      <!-- Title -->
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-full" />
        <div class="h-4 bg-gray-200 rounded w-3/4" />
      </div>

      <!-- Price -->
      <div class="h-6 bg-gray-200 rounded w-1/3" />

      <!-- Specs Row -->
      <div class="flex items-center space-x-2">
        <div class="h-3 bg-gray-200 rounded w-12" />
        <div class="h-3 bg-gray-200 rounded w-16" />
        <div class="h-3 bg-gray-200 rounded w-14" />
      </div>

      <!-- Location -->
      <div class="h-3 bg-gray-200 rounded w-2/5" />

      <!-- Seller -->
      <div class="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
</template>
