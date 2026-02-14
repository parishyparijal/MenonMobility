<template>
  <div>
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-navy">Welcome back, {{ user?.name }}!</h1>
      <p class="text-gray-500 mt-1">Here is an overview of your activity.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.activeListings }}</p>
        <p class="text-sm text-gray-500 mt-1">Active Listings</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.totalViews.toLocaleString() }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Views</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.totalFavorites }}</p>
        <p class="text-sm text-gray-500 mt-1">Favorites</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-orange-lighter rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.totalMessages }}</p>
        <p class="text-sm text-gray-500 mt-1">Messages</p>
      </div>
    </div>

    <!-- Quick Actions + Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quick Actions -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h2 class="font-bold text-navy mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <NuxtLink
            to="/seller/listings/new"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-lighter transition-colors group"
          >
            <div class="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors text-orange">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <p class="font-semibold text-navy text-sm">Add New Listing</p>
              <p class="text-xs text-gray-500">Create a new vehicle listing</p>
            </div>
          </NuxtLink>
          <NuxtLink
            to="/seller/messages"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-lighter transition-colors group"
          >
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div>
              <p class="font-semibold text-navy text-sm">View Messages</p>
              <p class="text-xs text-gray-500">Check buyer inquiries</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
        <h2 class="font-bold text-navy mb-4">Recent Activity</h2>
        <div v-if="recentActivity.length" class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', activity.iconBg]">
              <svg class="w-4 h-4" :class="activity.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.icon" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-navy">{{ activity.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'seller',
  middleware: 'seller',
})

const { user } = useAuth()
const { $api } = useNuxtApp()

const stats = reactive({
  activeListings: 0,
  totalViews: 0,
  totalFavorites: 0,
  totalMessages: 0,
})

const recentActivity = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await $api<{
      data: {
        active_listings: number
        total_views: number
        total_favorites: number
        total_messages: number
        recent_activity: any[]
      }
    }>('/seller/dashboard')

    stats.activeListings = res.data.active_listings
    stats.totalViews = res.data.total_views
    stats.totalFavorites = res.data.total_favorites
    stats.totalMessages = res.data.total_messages
    recentActivity.value = (res.data.recent_activity || []).map((a: any) => ({
      id: a.id,
      message: a.message,
      time: a.time,
      icon: a.type === 'view' ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' : a.type === 'favorite' ? 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' : 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      iconBg: a.type === 'view' ? 'bg-green-50' : a.type === 'favorite' ? 'bg-red-50' : 'bg-blue-50',
      iconColor: a.type === 'view' ? 'text-green-500' : a.type === 'favorite' ? 'text-red-500' : 'text-blue-500',
    }))
  } catch {
    // Defaults already set
  }
})

useHead({
  title: 'Seller Dashboard - MenonTrucks',
})
</script>
