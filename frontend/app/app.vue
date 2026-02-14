<template>
  <NuxtLayout>
    <Suspense>
      <NuxtPage />
    </Suspense>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'font-sans antialiased text-gray-800 bg-white',
  },
})
</script>
