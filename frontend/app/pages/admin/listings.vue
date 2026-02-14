<template>
  <div>
    <h1 class="text-2xl font-bold text-navy mb-8">Manage Listings</h1>

    <!-- Status Filter -->
    <div class="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        @click="selectedStatus = tab.value; page = 1"
        :class="[
          'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
          selectedStatus === tab.value ? 'border-orange text-orange' : 'border-transparent text-gray-500 hover:text-navy',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-xl border border-gray-200 p-6">
      <div v-for="i in 8" :key="i" class="flex gap-4 py-4 border-b border-gray-100 animate-pulse">
        <div class="w-16 h-12 bg-gray-200 rounded-lg" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/2" />
          <div class="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="!listings.length" class="p-12 text-center text-gray-400">
        <p>No listings found for this status</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Listing</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Seller</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="listing in listings" :key="listing.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-14 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img v-if="listing.images?.length" :src="listing.images[0].thumbnail" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-navy truncate max-w-[250px]">{{ listing.title }}</p>
                    <p class="text-xs text-gray-500">{{ listing.brand?.name }} &middot; {{ listing.year }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <p class="text-sm text-navy">{{ listing.seller?.name }}</p>
                <p class="text-xs text-gray-500">{{ listing.seller?.company }}</p>
              </td>
              <td class="py-3 px-4">
                <span :class="statusBadgeClass(listing.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                  {{ listing.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm font-semibold text-navy">{{ listing.currency }} {{ listing.price?.toLocaleString() }}</span>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm text-gray-500">{{ formatDate(listing.created_at) }}</span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <a :href="`/${listing.category?.slug}/${listing.slug}`" target="_blank" class="text-gray-400 hover:text-navy transition-colors" title="View">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </a>
                  <button
                    v-if="listing.status === 'pending'"
                    @click="approveListing(listing)"
                    class="text-green-500 hover:text-green-700 transition-colors"
                    title="Approve"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <button
                    v-if="listing.status === 'pending'"
                    @click="openRejectModal(listing)"
                    class="text-red-500 hover:text-red-700 transition-colors"
                    title="Reject"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p class="text-sm text-gray-500">Page {{ page }} of {{ lastPage }} ({{ total }} total)</p>
        <div class="flex gap-2">
          <button @click="page--" :disabled="page === 1" class="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-50 hover:border-orange transition-colors">Prev</button>
          <button @click="page++" :disabled="page === lastPage" class="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-50 hover:border-orange transition-colors">Next</button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <Teleport to="body">
      <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showRejectModal = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-navy mb-4">Reject Listing</h3>
          <p class="text-sm text-gray-500 mb-3">Rejecting: {{ rejectingListing?.title }}</p>
          <textarea v-model="rejectReason" rows="3" placeholder="Reason for rejection (will be sent to seller)..." class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy resize-none mb-4" />
          <div class="flex gap-3 justify-end">
            <button @click="showRejectModal = false" class="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
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
const route = useRoute()

const listings = ref<any[]>([])
const isLoading = ref(true)
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const selectedStatus = ref(String(route.query.status || 'all'))
const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectingListing = ref<any>(null)

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sold', value: 'sold' },
  { label: 'Expired', value: 'expired' },
  { label: 'Rejected', value: 'rejected' },
]

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    sold: 'bg-blue-100 text-blue-700',
    expired: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const fetchListings = async () => {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value }
    if (selectedStatus.value !== 'all') params.status = selectedStatus.value
    const res = await $api<{ data: any[]; meta: { last_page: number; total: number } }>('/admin/listings', { params })
    listings.value = res.data
    lastPage.value = res.meta.last_page
    total.value = res.meta.total
  } catch {
    listings.value = []
  } finally {
    isLoading.value = false
  }
}

watch([page, selectedStatus], () => fetchListings())
onMounted(() => fetchListings())

const approveListing = async (listing: any) => {
  try {
    await $api(`/admin/listings/${listing.id}/approve`, { method: 'POST' })
    listing.status = 'active'
  } catch { /* Error */ }
}

const openRejectModal = (listing: any) => {
  rejectingListing.value = listing
  rejectReason.value = ''
  showRejectModal.value = true
}

const rejectListing = async () => {
  if (!rejectingListing.value) return
  try {
    await $api(`/admin/listings/${rejectingListing.value.id}/reject`, {
      method: 'POST',
      body: { reason: rejectReason.value },
    })
    rejectingListing.value.status = 'rejected'
    showRejectModal.value = false
  } catch { /* Error */ }
}

useHead({ title: 'Manage Listings - Admin - MenonTrucks' })
</script>
