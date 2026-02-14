<template>
  <div>
    <h1 class="text-2xl font-bold text-navy mb-8">Manage Users</h1>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or email..."
        class="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange outline-none text-sm text-navy"
        @input="debouncedSearch"
      />
      <select v-model="roleFilter" @change="page = 1; fetchUsers()" class="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange outline-none text-sm text-navy">
        <option value="">All Roles</option>
        <option value="buyer">Buyers</option>
        <option value="seller">Sellers</option>
        <option value="admin">Admins</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-xl border border-gray-200 p-6">
      <div v-for="i in 10" :key="i" class="flex gap-4 py-3 border-b border-gray-100 animate-pulse">
        <div class="w-10 h-10 bg-gray-200 rounded-full" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/3" />
          <div class="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="!users.length" class="p-12 text-center text-gray-400">
        <p>No users found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Listings</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-navy">{{ user.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm text-gray-600">{{ user.email }}</span>
              </td>
              <td class="py-3 px-4">
                <span :class="roleBadge(user.role)" class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">{{ user.role }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <span class="text-sm text-gray-600">{{ user.listings_count || 0 }}</span>
              </td>
              <td class="py-3 px-4">
                <span :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm text-gray-500">{{ formatDate(user.created_at) }}</span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.is_active ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'"
                    class="transition-colors"
                    :title="user.is_active ? 'Deactivate' : 'Activate'"
                  >
                    <svg v-if="user.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p class="text-sm text-gray-500">Page {{ page }} of {{ lastPage }} ({{ total }} users)</p>
        <div class="flex gap-2">
          <button @click="page--" :disabled="page === 1" class="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-50 hover:border-orange transition-colors">Prev</button>
          <button @click="page++" :disabled="page === lastPage" class="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-50 hover:border-orange transition-colors">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  listings_count: number
  is_active: boolean
  created_at: string
}

const users = ref<AdminUser[]>([])
const isLoading = ref(true)
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const searchQuery = ref('')
const roleFilter = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const debouncedSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    fetchUsers()
  }, 300)
}

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    buyer: 'bg-blue-100 text-blue-700',
    seller: 'bg-orange-lighter text-orange',
    admin: 'bg-red-100 text-red-700',
  }
  return map[role] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value }
    if (searchQuery.value) params.search = searchQuery.value
    if (roleFilter.value) params.role = roleFilter.value
    const res = await $api<{ data: AdminUser[]; meta: { last_page: number; total: number } }>('/admin/users', { params })
    users.value = res.data
    lastPage.value = res.meta.last_page
    total.value = res.meta.total
  } catch {
    users.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleUserStatus = async (user: AdminUser) => {
  try {
    await $api(`/admin/users/${user.id}/toggle-status`, { method: 'POST' })
    user.is_active = !user.is_active
  } catch {
    // Error
  }
}

watch(page, () => fetchUsers())
onMounted(() => fetchUsers())

useHead({ title: 'Manage Users - Admin - MenonTrucks' })
</script>
