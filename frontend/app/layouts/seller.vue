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
          <span class="text-xl font-bold text-orange">Trucks</span>
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
                ? 'bg-orange text-white'
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

        <div class="flex-1" />

        <!-- User info -->
        <div class="flex items-center space-x-3">
          <span class="text-sm text-gray-600 hidden sm:block">{{ user?.name }}</span>
          <div class="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-semibold text-sm">
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
    path: '/seller/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'My Listings',
    path: '/seller/listings',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    label: 'Add Listing',
    path: '/seller/listings/new',
    icon: 'M12 4v16m8-8H4',
  },
  {
    label: 'Messages',
    path: '/seller/messages',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    label: 'Profile',
    path: '/seller/profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    label: 'Subscription',
    path: '/seller/subscription',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
]

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
