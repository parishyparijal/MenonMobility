<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center space-x-1 mb-8">
      <span class="text-3xl font-bold text-navy">Menon</span>
      <span class="text-3xl font-bold text-orange">Trucks</span>
    </NuxtLink>

    <!-- Content -->
    <div class="w-full max-w-md">
      <slot />
    </div>

    <!-- Footer -->
    <p class="mt-8 text-sm text-gray-400">
      &copy; {{ new Date().getFullYear() }} MenonTrucks. All rights reserved.
    </p>
  </div>
</template>

<script setup lang="ts">
</script>
