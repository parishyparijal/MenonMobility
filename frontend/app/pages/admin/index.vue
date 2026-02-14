<template>
  <div>
    <h1 class="text-2xl font-bold text-navy mb-8">Admin Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.totalListings.toLocaleString() }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Listings</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.pendingReview }}</p>
        <p class="text-sm text-gray-500 mt-1">Pending Review</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.totalUsers.toLocaleString() }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Users</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-orange-lighter rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-navy">{{ stats.totalSellers }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Sellers</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- New Listings Chart -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h2 class="font-bold text-navy mb-4">New Listings (Last 30 Days)</h2>
        <div class="h-64 flex items-end gap-1">
          <div
            v-for="(day, idx) in chartData.listings"
            :key="idx"
            class="flex-1 bg-orange/20 hover:bg-orange/40 rounded-t transition-colors relative group"
            :style="{ height: `${(day.count / maxListingCount) * 100}%`, minHeight: '4px' }"
          >
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ day.date }}: {{ day.count }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-400">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      <!-- New Registrations Chart -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h2 class="font-bold text-navy mb-4">New Registrations (Last 30 Days)</h2>
        <div class="h-64 flex items-end gap-1">
          <div
            v-for="(day, idx) in chartData.registrations"
            :key="idx"
            class="flex-1 bg-green-200 hover:bg-green-300 rounded-t transition-colors relative group"
            :style="{ height: `${(day.count / maxRegCount) * 100}%`, minHeight: '4px' }"
          >
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ day.date }}: {{ day.count }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-400">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>

    <!-- Pending Listings -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 class="font-bold text-navy">Pending Review</h2>
        <NuxtLink to="/admin/listings?status=pending" class="text-sm text-orange hover:text-orange-light font-medium transition-colors">View All</NuxtLink>
      </div>
      <div v-if="!pendingListings.length" class="p-8 text-center text-gray-400">
        <p>No listings pending review</p>
      </div>
      <div v-else class="divide-y divide-gray-100">
        <div v-for="listing in pendingListings" :key="listing.id" class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
          <div class="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img v-if="listing.images?.length" :src="listing.images[0].thumbnail" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-navy text-sm truncate">{{ listing.title }}</p>
            <p class="text-xs text-gray-500">by {{ listing.seller?.name }} &middot; {{ formatDate(listing.created_at) }}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="approveListing(listing.id)"
              class="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
            >
              Approve
            </button>
            <button
              @click="openRejectModal(listing)"
              class="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <Teleport to="body">
      <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showRejectModal = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-navy mb-4">Reject Listing</h3>
          <textarea
            v-model="rejectReason"
            rows="3"
            placeholder="Reason for rejection..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy resize-none mb-4"
          />
          <div class="flex gap-3 justify-end">
            <button @click="showRejectModal = false" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors">Cancel</button>
            <button @click="rejectListing" class="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">Reject</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()

const stats = reactive({
  totalListings: 0,
  pendingReview: 0,
  totalUsers: 0,
  totalSellers: 0,
})

const chartData = reactive({
  listings: [] as { date: string; count: number }[],
  registrations: [] as { date: string; count: number }[],
})

const pendingListings = ref<any[]>([])
const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectingListingId = ref<number | null>(null)

const maxListingCount = computed(() => Math.max(1, ...chartData.listings.map((d) => d.count)))
const maxRegCount = computed(() => Math.max(1, ...chartData.registrations.map((d) => d.count)))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await $api<{
      data: {
        total_listings: number
        pending_review: number
        total_users: number
        total_sellers: number
        listings_chart: { date: string; count: number }[]
        registrations_chart: { date: string; count: number }[]
        pending_listings: any[]
      }
    }>('/admin/dashboard')

    stats.totalListings = res.data.total_listings
    stats.pendingReview = res.data.pending_review
    stats.totalUsers = res.data.total_users
    stats.totalSellers = res.data.total_sellers
    chartData.listings = res.data.listings_chart || []
    chartData.registrations = res.data.registrations_chart || []
    pendingListings.value = res.data.pending_listings || []
  } catch {
    // Use defaults
  }
})

const approveListing = async (id: number) => {
  try {
    await $api(`/admin/listings/${id}/approve`, { method: 'POST' })
    pendingListings.value = pendingListings.value.filter((l) => l.id !== id)
    stats.pendingReview = Math.max(0, stats.pendingReview - 1)
  } catch {
    // Error
  }
}

const openRejectModal = (listing: any) => {
  rejectingListingId.value = listing.id
  rejectReason.value = ''
  showRejectModal.value = true
}

const rejectListing = async () => {
  if (!rejectingListingId.value) return
  try {
    await $api(`/admin/listings/${rejectingListingId.value}/reject`, {
      method: 'POST',
      body: { reason: rejectReason.value },
    })
    pendingListings.value = pendingListings.value.filter((l) => l.id !== rejectingListingId.value)
    stats.pendingReview = Math.max(0, stats.pendingReview - 1)
    showRejectModal.value = false
  } catch {
    // Error
  }
}

useHead({
  title: 'Admin Dashboard - MenonTrucks',
})
</script>
