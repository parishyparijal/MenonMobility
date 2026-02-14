<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-navy">My Listings</h1>
        <p class="text-gray-500 mt-1">Manage all your vehicle listings</p>
      </div>
      <NuxtLink
        to="/seller/listings/new"
        class="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Add New Listing
      </NuxtLink>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        @click="selectedStatus = tab.value"
        :class="[
          'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
          selectedStatus === tab.value
            ? 'border-orange text-orange'
            : 'border-transparent text-gray-500 hover:text-navy',
        ]"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-4 border border-gray-200 animate-pulse flex gap-4">
        <div class="w-24 h-20 bg-gray-200 rounded-lg" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!listings.length" class="text-center py-16 bg-white rounded-xl border border-gray-200">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-semibold text-navy mb-2">No listings yet</h3>
      <p class="text-gray-500 mb-6">Create your first listing to start selling</p>
      <NuxtLink to="/seller/listings/new" class="bg-orange hover:bg-orange-light text-white px-6 py-2 rounded-lg font-semibold transition-colors">
        Create Listing
      </NuxtLink>
    </div>

    <!-- Listings Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Listing</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
              <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Views</th>
              <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Favs</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="listing in listings" :key="listing.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img v-if="listing.images?.length" :src="listing.images[0].thumbnail" :alt="listing.title" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-navy truncate max-w-[200px]">{{ listing.title }}</p>
                    <p class="text-xs text-gray-500">{{ listing.brand?.name }} &middot; {{ listing.year }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="statusBadgeClass(listing.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                  {{ listing.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm font-semibold text-navy">{{ listing.currency }} {{ listing.price?.toLocaleString() }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <span class="text-sm text-gray-600">{{ listing.views_count }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <span class="text-sm text-gray-600">{{ listing.favorites_count }}</span>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm text-gray-500">{{ formatDate(listing.created_at) }}</span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/seller/listings/${listing.id}`"
                    class="text-gray-400 hover:text-orange transition-colors"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </NuxtLink>
                  <button
                    @click="confirmDelete(listing)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p class="text-sm text-gray-500">Page {{ page }} of {{ lastPage }}</p>
        <div class="flex gap-2">
          <button @click="page--" :disabled="page === 1" class="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-50 hover:border-orange transition-colors">Prev</button>
          <button @click="page++" :disabled="page === lastPage" class="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-50 hover:border-orange transition-colors">Next</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-navy mb-2">Delete Listing</h3>
          <p class="text-gray-500 mb-6">Are you sure you want to delete "{{ deletingListing?.title }}"? This action cannot be undone.</p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors">Cancel</button>
            <button @click="handleDelete" :disabled="deleteLoading" class="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50">
              {{ deleteLoading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'seller',
  middleware: 'seller',
})

const { $api } = useNuxtApp()
const { deleteListing } = useListings()

const listings = ref<any[]>([])
const isLoading = ref(true)
const page = ref(1)
const lastPage = ref(1)
const selectedStatus = ref('all')
const showDeleteModal = ref(false)
const deletingListing = ref<any>(null)
const deleteLoading = ref(false)

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Sold', value: 'sold' },
  { label: 'Expired', value: 'expired' },
]

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    sold: 'bg-blue-100 text-blue-700',
    expired: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const fetchMyListings = async () => {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value }
    if (selectedStatus.value !== 'all') params.status = selectedStatus.value
    const res = await $api<{ data: any[]; meta: { last_page: number } }>('/seller/listings', { params })
    listings.value = res.data
    lastPage.value = res.meta.last_page
  } catch {
    listings.value = []
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = (listing: any) => {
  deletingListing.value = listing
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deletingListing.value) return
  deleteLoading.value = true
  try {
    await deleteListing(deletingListing.value.id)
    listings.value = listings.value.filter((l) => l.id !== deletingListing.value.id)
    showDeleteModal.value = false
  } catch {
    // Error handled in composable
  } finally {
    deleteLoading.value = false
  }
}

watch([page, selectedStatus], () => {
  page.value = selectedStatus.value ? 1 : page.value
  fetchMyListings()
})

onMounted(() => fetchMyListings())

useHead({
  title: 'My Listings - MenonTrucks',
})
</script>
