<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-navy transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-6 border-b border-navy-light">
        <NuxtLink to="/" class="flex items-center space-x-1">
          <span class="text-xl font-bold text-white">Menon</span>
          <span class="text-xl font-bold text-red-500">Admin</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <NuxtLink
            v-for="item in sidebarItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActiveRoute(item.path)
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:bg-navy-light hover:text-white',
            ]"
            @click="sidebarOpen = false"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>

        <!-- Back to Site -->
        <div class="mt-8 pt-4 border-t border-navy-light">
          <NuxtLink
            to="/"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-navy-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Site</span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8">
        <!-- Mobile menu button -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden mr-4 text-gray-600 hover:text-navy transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="text-lg font-semibold text-navy">Admin Panel</h1>

        <div class="flex-1" />

        <!-- User info -->
        <div class="flex items-center space-x-3">
          <span class="text-sm text-gray-600 hidden sm:block">{{ user?.name }}</span>
          <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm">
            {{ user?.name?.charAt(0)?.toUpperCase() }}
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const route = useRoute()
const sidebarOpen = ref(false)

const sidebarItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Listings',
    path: '/admin/listings',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    label: 'Brands',
    path: '/admin/brands',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
