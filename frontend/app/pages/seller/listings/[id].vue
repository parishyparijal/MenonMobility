<template>
  <div>
    <div class="flex items-center gap-3 mb-8">
      <NuxtLink to="/seller/listings" class="text-gray-400 hover:text-navy transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-navy">Edit Listing</h1>
        <p class="text-gray-500 text-sm">Update your vehicle listing details</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-xl border border-gray-200 p-8 animate-pulse space-y-6">
      <div class="h-8 bg-gray-200 rounded w-1/3" />
      <div class="grid grid-cols-2 gap-6">
        <div class="h-12 bg-gray-200 rounded" />
        <div class="h-12 bg-gray-200 rounded" />
      </div>
    </div>

    <!-- Form -->
    <div v-else class="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
      <!-- Progress Steps -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <template v-for="(step, idx) in steps" :key="idx">
          <button
            @click="currentStep = idx"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              currentStep === idx ? 'bg-orange text-white' : 'bg-gray-100 text-gray-500 hover:text-navy',
            ]"
          >
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" :class="currentStep === idx ? 'bg-white text-orange' : 'bg-gray-300 text-white'">{{ idx + 1 }}</span>
            {{ step }}
          </button>
          <div v-if="idx < steps.length - 1" class="w-8 h-px bg-gray-300 flex-shrink-0" />
        </template>
      </div>

      <!-- Step 1: Basic Info -->
      <div v-show="currentStep === 0">
        <h2 class="text-lg font-bold text-navy mb-6">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-navy mb-1.5">Title *</label>
            <input v-model="form.title" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Brand *</label>
            <input v-model="form.brand" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Model *</label>
            <input v-model="form.model" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Condition *</label>
            <select v-model="form.condition" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy">
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="certified">Certified Pre-Owned</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Price *</label>
            <div class="flex gap-2">
              <select v-model="form.currency" class="w-24 px-3 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
              <input v-model.number="form.price" type="number" class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Details -->
      <div v-show="currentStep === 1">
        <h2 class="text-lg font-bold text-navy mb-6">Vehicle Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Year *</label>
            <input v-model.number="form.year" type="number" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Mileage (km)</label>
            <input v-model.number="form.mileage" type="number" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Fuel Type</label>
            <select v-model="form.fuel_type" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy">
              <option value="">Select</option>
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="cng">CNG</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Transmission</label>
            <select v-model="form.transmission" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy">
              <option value="">Select</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="semi-automatic">Semi-Automatic</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Engine Power</label>
            <input v-model="form.engine_power" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">GVW (kg)</label>
            <input v-model.number="form.gvw" type="number" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Color</label>
            <input v-model="form.color" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
        </div>
      </div>

      <!-- Step 3: Description -->
      <div v-show="currentStep === 2">
        <h2 class="text-lg font-bold text-navy mb-6">Description</h2>
        <textarea v-model="form.description" rows="12" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy resize-none" />
        <p class="text-sm text-gray-400 mt-2 text-right">{{ form.description.length }} / 5000</p>
      </div>

      <!-- Step 4: Images -->
      <div v-show="currentStep === 3">
        <h2 class="text-lg font-bold text-navy mb-6">Photos</h2>

        <!-- Existing Images -->
        <div v-if="existingImages.length" class="mb-6">
          <h3 class="text-sm font-semibold text-gray-500 mb-3">Current Photos</h3>
          <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
            <div v-for="(img, idx) in existingImages" :key="img.id" class="relative group">
              <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img :src="img.thumbnail" class="w-full h-full object-cover" />
              </div>
              <button
                @click="deleteExistingImage(img.id, idx)"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <span v-if="idx === 0" class="absolute bottom-1 left-1 bg-orange text-white text-xs px-1.5 py-0.5 rounded font-medium">Main</span>
            </div>
          </div>
        </div>

        <!-- Upload New -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          :class="['border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer', isDragging ? 'border-orange bg-orange-lighter' : 'border-gray-300 hover:border-orange']"
          @click="fileInput?.click()"
        >
          <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
          <p class="text-gray-600 font-medium">Add more images</p>
          <p class="text-sm text-gray-400 mt-1">Drag and drop or click to browse</p>
        </div>

        <div v-if="newImagePreviews.length" class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          <div v-for="(img, idx) in newImagePreviews" :key="idx" class="relative group">
            <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img :src="img.preview" class="w-full h-full object-cover" />
            </div>
            <button
              @click="removeNewImage(idx)"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 5: Location -->
      <div v-show="currentStep === 4">
        <h2 class="text-lg font-bold text-navy mb-6">Location & Contact</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Country *</label>
            <input v-model="form.country" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">City *</label>
            <input v-model="form.city" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Phone</label>
            <input v-model="form.phone" type="tel" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button v-if="currentStep > 0" @click="currentStep--" class="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:text-navy transition-colors">Previous</button>
        <div v-else />
        <div class="flex gap-3">
          <button v-if="currentStep < steps.length - 1" @click="currentStep++" class="px-6 py-2.5 text-sm font-medium bg-orange hover:bg-orange-light text-white rounded-lg transition-colors">Next</button>
          <button v-else @click="handleSave" :disabled="isSaving" class="px-6 py-2.5 text-sm font-medium bg-orange hover:bg-orange-light text-white rounded-lg transition-colors disabled:opacity-50">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
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

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { updateListing, uploadImages, deleteImage } = useListings()

const listingId = Number(route.params.id)
const currentStep = ref(0)
const isLoading = ref(true)
const isSaving = ref(false)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const steps = ['Basic Info', 'Details', 'Description', 'Photos', 'Location']

const form = reactive({
  title: '',
  brand: '',
  model: '',
  condition: '',
  currency: 'EUR',
  price: null as number | null,
  year: null as number | null,
  mileage: null as number | null,
  fuel_type: '',
  transmission: '',
  engine_power: '',
  gvw: null as number | null,
  color: '',
  description: '',
  country: '',
  city: '',
  phone: '',
  email: '',
})

const existingImages = ref<{ id: number; url: string; thumbnail: string }[]>([])
const newImageFiles = ref<File[]>([])
const newImagePreviews = ref<{ file: File; preview: string }[]>([])

// Load listing
onMounted(async () => {
  try {
    const res = await $api<{ data: any }>(`/seller/listings/${listingId}`)
    const l = res.data
    form.title = l.title
    form.brand = l.brand?.name || l.brand || ''
    form.model = l.model
    form.condition = l.condition
    form.currency = l.currency
    form.price = l.price
    form.year = l.year
    form.mileage = l.mileage
    form.fuel_type = l.fuel_type || ''
    form.transmission = l.transmission || ''
    form.engine_power = l.engine_power || ''
    form.gvw = l.gvw
    form.color = l.color || ''
    form.description = l.description
    form.country = l.country
    form.city = l.location || ''
    form.phone = l.seller?.phone || ''
    form.email = l.seller?.email || ''
    existingImages.value = l.images || []
  } catch {
    await router.push('/seller/listings')
  } finally {
    isLoading.value = false
  }
})

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'))
  addFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  addFiles(Array.from(target.files || []))
  target.value = ''
}

const addFiles = (files: File[]) => {
  for (const file of files) {
    newImageFiles.value.push(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      newImagePreviews.value.push({ file, preview: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }
}

const removeNewImage = (idx: number) => {
  newImagePreviews.value.splice(idx, 1)
  newImageFiles.value.splice(idx, 1)
}

const deleteExistingImage = async (imageId: number, idx: number) => {
  try {
    await deleteImage(imageId)
    existingImages.value.splice(idx, 1)
  } catch {
    // Error handled in composable
  }
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await updateListing(listingId, form as unknown as Record<string, unknown>)
    if (newImageFiles.value.length) {
      await uploadImages(listingId, newImageFiles.value)
    }
    await router.push('/seller/listings')
  } catch {
    // Error handled in composable
  } finally {
    isSaving.value = false
  }
}

useHead({
  title: 'Edit Listing - MenonTrucks',
})
</script>
