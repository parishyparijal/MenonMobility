<template>
  <div>
    <h1 class="text-2xl font-bold text-navy mb-2">Seller Profile</h1>
    <p class="text-gray-500 mb-8">Manage your public seller information</p>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
      {{ successMessage }}
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
      <!-- Logo Upload -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-navy mb-3">Company Logo</label>
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
            <img v-if="logoPreview || form.avatar" :src="logoPreview || form.avatar" class="w-full h-full object-cover" />
            <svg v-else class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <button @click="logoInput?.click()" class="bg-gray-100 hover:bg-gray-200 text-navy px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Upload Logo
            </button>
            <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoSelect" />
            <p class="text-xs text-gray-400 mt-2">PNG, JPG. Recommended 200x200px.</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-navy mb-1.5">Company Name *</label>
            <input v-model="form.company" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="Your company name" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-navy mb-1.5">Description</label>
            <textarea v-model="form.description" rows="4" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy resize-none" placeholder="Tell buyers about your business..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Website</label>
            <input v-model="form.website" type="url" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="https://www.example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Phone</label>
            <input v-model="form.phone" type="tel" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="+49 123 456 789" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-navy mb-1.5">Address</label>
            <input v-model="form.address" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="Street address" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">City</label>
            <input v-model="form.city" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="City" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Region / State</label>
            <input v-model="form.region" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="Region" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Country *</label>
            <input v-model="form.country" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" placeholder="Country" />
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isSaving"
            class="bg-orange hover:bg-orange-light text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'seller',
  middleware: 'seller',
})

const { $api } = useNuxtApp()

const isSaving = ref(false)
const successMessage = ref('')
const logoInput = ref<HTMLInputElement | null>(null)
const logoPreview = ref('')
const logoFile = ref<File | null>(null)

const form = reactive({
  company: '',
  description: '',
  website: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  country: '',
  avatar: '',
})

// Load profile
onMounted(async () => {
  try {
    const res = await $api<{ data: any }>('/seller/profile')
    const p = res.data
    form.company = p.company || ''
    form.description = p.description || ''
    form.website = p.website || ''
    form.phone = p.phone || ''
    form.address = p.address || ''
    form.city = p.city || ''
    form.region = p.region || ''
    form.country = p.country || ''
    form.avatar = p.avatar || ''
  } catch {
    // Use defaults
  }
})

const handleLogoSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  logoFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => {
    logoPreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleSave = async () => {
  isSaving.value = true
  successMessage.value = ''
  try {
    // Upload logo first if changed
    if (logoFile.value) {
      const formData = new FormData()
      formData.append('avatar', logoFile.value)
      await $api('/seller/profile/avatar', { method: 'POST', body: formData })
    }

    await $api('/seller/profile', {
      method: 'PUT',
      body: {
        company: form.company,
        description: form.description,
        website: form.website,
        phone: form.phone,
        address: form.address,
        city: form.city,
        region: form.region,
        country: form.country,
      },
    })

    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch {
    // Error handled
  } finally {
    isSaving.value = false
  }
}

useHead({
  title: 'Seller Profile - MenonTrucks',
})
</script>
