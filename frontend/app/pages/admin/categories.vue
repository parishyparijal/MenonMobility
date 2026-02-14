<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-navy">Manage Categories</h1>
      <button @click="openModal()" class="bg-orange hover:bg-orange-light text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Add Category
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div v-for="i in 6" :key="i" class="h-12 bg-gray-100 rounded-lg animate-pulse" />
    </div>

    <!-- Category Tree -->
    <div v-else class="bg-white rounded-xl border border-gray-200">
      <div v-if="!categories.length" class="p-12 text-center text-gray-400">
        <p>No categories yet. Add your first category to get started.</p>
      </div>
      <div v-else class="divide-y divide-gray-100">
        <template v-for="category in categories" :key="category.id">
          <!-- Parent Category -->
          <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <button
                v-if="category.children?.length"
                @click="toggleExpand(category.id)"
                class="text-gray-400 hover:text-navy transition-colors"
              >
                <svg :class="['w-5 h-5 transition-transform', expandedIds.has(category.id) ? 'rotate-90' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div v-else class="w-5" />
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-navy">{{ category.name }}</p>
                <p class="text-xs text-gray-500">/{{ category.slug }} &middot; {{ category.listings_count || 0 }} listings</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openModal(category)" class="text-gray-400 hover:text-orange transition-colors" title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button @click="confirmDelete(category)" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          <!-- Children -->
          <template v-if="expandedIds.has(category.id)">
            <div
              v-for="child in category.children"
              :key="child.id"
              class="flex items-center justify-between px-6 py-3 pl-16 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-navy text-sm">{{ child.name }}</p>
                  <p class="text-xs text-gray-400">/{{ child.slug }} &middot; {{ child.listings_count || 0 }} listings</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="openModal(child)" class="text-gray-400 hover:text-orange transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button @click="confirmDelete(child)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showModal = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-navy mb-6">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-navy mb-1.5">Name *</label>
              <input v-model="modalForm.name" type="text" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="Category name" @input="autoSlug" />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy mb-1.5">Slug *</label>
              <input v-model="modalForm.slug" type="text" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="category-slug" />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy mb-1.5">Parent Category</label>
              <select v-model="modalForm.parent_id" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy">
                <option :value="null">None (Top Level)</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy mb-1.5">Icon (SVG path)</label>
              <input v-model="modalForm.icon" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="M9 17a2 2 0..." />
            </div>
            <div class="flex gap-3 justify-end pt-4">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors">Cancel</button>
              <button type="submit" :disabled="isSaving" class="px-6 py-2 text-sm font-medium bg-orange hover:bg-orange-light text-white rounded-lg transition-colors disabled:opacity-50">
                {{ isSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showDeleteConfirm = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-bold text-navy mb-2">Delete Category</h3>
          <p class="text-gray-500 mb-6">Are you sure you want to delete "{{ deletingCategory?.name }}"? This will also remove all subcategories.</p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteConfirm = false" class="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
            <button @click="deleteCategory" class="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">Delete</button>
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

interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  parent_id?: number | null
  listings_count?: number
  children?: Category[]
}

const categories = ref<Category[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingCategory = ref<Category | null>(null)
const deletingCategory = ref<Category | null>(null)
const expandedIds = ref<Set<number>>(new Set())

const modalForm = reactive({
  name: '',
  slug: '',
  parent_id: null as number | null,
  icon: '',
})

const toggleExpand = (id: number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

const autoSlug = () => {
  if (!editingCategory.value) {
    modalForm.slug = modalForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
}

const openModal = (category?: Category) => {
  editingCategory.value = category || null
  if (category) {
    modalForm.name = category.name
    modalForm.slug = category.slug
    modalForm.parent_id = category.parent_id || null
    modalForm.icon = category.icon || ''
  } else {
    modalForm.name = ''
    modalForm.slug = ''
    modalForm.parent_id = null
    modalForm.icon = ''
  }
  showModal.value = true
}

const confirmDelete = (category: Category) => {
  deletingCategory.value = category
  showDeleteConfirm.value = true
}

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const res = await $api<{ data: Category[] }>('/admin/categories')
    categories.value = res.data
  } catch {
    categories.value = []
  } finally {
    isLoading.value = false
  }
}

const saveCategory = async () => {
  isSaving.value = true
  try {
    if (editingCategory.value) {
      await $api(`/admin/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: modalForm,
      })
    } else {
      await $api('/admin/categories', {
        method: 'POST',
        body: modalForm,
      })
    }
    showModal.value = false
    await fetchCategories()
  } catch {
    // Error
  } finally {
    isSaving.value = false
  }
}

const deleteCategory = async () => {
  if (!deletingCategory.value) return
  try {
    await $api(`/admin/categories/${deletingCategory.value.id}`, { method: 'DELETE' })
    showDeleteConfirm.value = false
    await fetchCategories()
  } catch {
    // Error
  }
}

onMounted(() => fetchCategories())

useHead({ title: 'Manage Categories - Admin - MenonTrucks' })
</script>
