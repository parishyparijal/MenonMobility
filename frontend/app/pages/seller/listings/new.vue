<template>
  <div>
    <h1 class="text-2xl font-bold text-navy mb-2">Create New Listing</h1>
    <p class="text-gray-500 mb-8">Fill in the details below to list your vehicle.</p>

    <!-- Progress Steps -->
    <div class="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
      <template v-for="(step, idx) in steps" :key="idx">
        <button
          @click="goToStep(idx)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            currentStep === idx
              ? 'bg-orange text-white'
              : currentStep > idx
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500',
          ]"
        >
          <span :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
            currentStep === idx ? 'bg-white text-orange' : currentStep > idx ? 'bg-green-500 text-white' : 'bg-gray-300 text-white',
          ]">
            <svg v-if="currentStep > idx" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            <span v-else>{{ idx + 1 }}</span>
          </span>
          {{ step.title }}
        </button>
        <div v-if="idx < steps.length - 1" class="w-8 h-px bg-gray-300 flex-shrink-0" />
      </template>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
      <!-- Step 1: Category -->
      <div v-show="currentStep === 0">
        <h2 class="text-lg font-bold text-navy mb-6">Select a Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            v-for="cat in categoryOptions"
            :key="cat.value"
            @click="form.category = cat.value"
            :class="[
              'p-6 rounded-xl border-2 text-center transition-colors',
              form.category === cat.value
                ? 'border-orange bg-orange-lighter'
                : 'border-gray-200 hover:border-orange-light',
            ]"
          >
            <svg class="w-10 h-10 mx-auto mb-3 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="cat.icon" />
            </svg>
            <span class="font-semibold text-navy">{{ cat.label }}</span>
          </button>
        </div>
        <p v-if="stepErrors[0]" class="text-red-500 text-sm mt-4">{{ stepErrors[0] }}</p>
      </div>

      <!-- Step 2: Basic Info -->
      <div v-show="currentStep === 1">
        <h2 class="text-lg font-bold text-navy mb-6">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-navy mb-1.5">Title *</label>
            <input v-model="form.title" type="text" placeholder="e.g. 2020 Volvo FH16 750 6x4 Tractor" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Brand *</label>
            <input v-model="form.brand" type="text" placeholder="e.g. Volvo" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Model *</label>
            <input v-model="form.model" type="text" placeholder="e.g. FH16 750" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Condition *</label>
            <select v-model="form.condition" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy">
              <option value="">Select condition</option>
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
              <input v-model.number="form.price" type="number" placeholder="0" class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
            </div>
          </div>
        </div>
        <p v-if="stepErrors[1]" class="text-red-500 text-sm mt-4">{{ stepErrors[1] }}</p>
      </div>

      <!-- Step 3: Details -->
      <div v-show="currentStep === 2">
        <h2 class="text-lg font-bold text-navy mb-6">Vehicle Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Year *</label>
            <input v-model.number="form.year" type="number" placeholder="2024" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Mileage (km)</label>
            <input v-model.number="form.mileage" type="number" placeholder="0" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
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
              <option value="lpg">LPG</option>
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
            <input v-model="form.engine_power" type="text" placeholder="e.g. 750 hp" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">GVW (kg)</label>
            <input v-model.number="form.gvw" type="number" placeholder="0" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Axles</label>
            <input v-model.number="form.axles" type="number" placeholder="2" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Wheelbase</label>
            <input v-model="form.wheelbase" type="text" placeholder="e.g. 3800 mm" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Color</label>
            <input v-model="form.color" type="text" placeholder="e.g. White" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
        </div>
        <p v-if="stepErrors[2]" class="text-red-500 text-sm mt-4">{{ stepErrors[2] }}</p>
      </div>

      <!-- Step 4: Description -->
      <div v-show="currentStep === 3">
        <h2 class="text-lg font-bold text-navy mb-6">Description</h2>
        <div>
          <textarea
            v-model="form.description"
            rows="10"
            placeholder="Describe your vehicle in detail. Include key features, condition details, service history, and any extras included..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy resize-none"
          />
          <p class="text-sm text-gray-400 mt-2 text-right">{{ form.description.length }} / 5000 characters</p>
        </div>
        <p v-if="stepErrors[3]" class="text-red-500 text-sm mt-4">{{ stepErrors[3] }}</p>
      </div>

      <!-- Step 5: Images -->
      <div v-show="currentStep === 4">
        <h2 class="text-lg font-bold text-navy mb-6">Photos</h2>
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          :class="[
            'border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer',
            isDragging ? 'border-orange bg-orange-lighter' : 'border-gray-300 hover:border-orange',
          ]"
          @click="fileInput?.click()"
        >
          <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-600 font-medium">Drag and drop images here, or click to browse</p>
          <p class="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB. Maximum 20 images.</p>
        </div>

        <!-- Image Previews -->
        <div v-if="imagePreviews.length" class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          <div v-for="(img, idx) in imagePreviews" :key="idx" class="relative group">
            <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img :src="img.preview" class="w-full h-full object-cover" />
            </div>
            <button
              @click="removeImage(idx)"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <span v-if="idx === 0" class="absolute bottom-1 left-1 bg-orange text-white text-xs px-1.5 py-0.5 rounded font-medium">Main</span>
          </div>
        </div>
        <p v-if="stepErrors[4]" class="text-red-500 text-sm mt-4">{{ stepErrors[4] }}</p>
      </div>

      <!-- Step 6: Location & Contact -->
      <div v-show="currentStep === 5">
        <h2 class="text-lg font-bold text-navy mb-6">Location & Contact</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Country *</label>
            <input v-model="form.country" type="text" placeholder="e.g. Germany" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">City *</label>
            <input v-model="form.city" type="text" placeholder="e.g. Munich" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Phone</label>
            <input v-model="form.phone" type="tel" placeholder="+49 123 456 789" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">Email</label>
            <input v-model="form.email" type="email" placeholder="contact@dealer.com" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy mb-1.5">WhatsApp Number</label>
            <input v-model="form.whatsapp" type="tel" placeholder="+49 123 456 789" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy" />
          </div>
        </div>
        <p v-if="stepErrors[5]" class="text-red-500 text-sm mt-4">{{ stepErrors[5] }}</p>
      </div>

      <!-- Step 7: Review -->
      <div v-show="currentStep === 6">
        <h2 class="text-lg font-bold text-navy mb-6">Review & Submit</h2>
        <div class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Category</h3>
            <p class="text-gray-600 capitalize">{{ form.category }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Basic Info</h3>
            <p class="text-gray-600"><strong>Title:</strong> {{ form.title }}</p>
            <p class="text-gray-600"><strong>Brand:</strong> {{ form.brand }} {{ form.model }}</p>
            <p class="text-gray-600"><strong>Condition:</strong> {{ form.condition }}</p>
            <p class="text-gray-600"><strong>Price:</strong> {{ form.currency }} {{ form.price?.toLocaleString() }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Details</h3>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <p><strong>Year:</strong> {{ form.year }}</p>
              <p v-if="form.mileage"><strong>Mileage:</strong> {{ form.mileage.toLocaleString() }} km</p>
              <p v-if="form.fuel_type"><strong>Fuel:</strong> {{ form.fuel_type }}</p>
              <p v-if="form.transmission"><strong>Transmission:</strong> {{ form.transmission }}</p>
              <p v-if="form.engine_power"><strong>Power:</strong> {{ form.engine_power }}</p>
              <p v-if="form.gvw"><strong>GVW:</strong> {{ form.gvw }} kg</p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Description</h3>
            <p class="text-gray-600 whitespace-pre-line text-sm">{{ form.description || 'No description provided' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Photos</h3>
            <div v-if="imagePreviews.length" class="flex gap-2 flex-wrap">
              <div v-for="(img, idx) in imagePreviews" :key="idx" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                <img :src="img.preview" class="w-full h-full object-cover" />
              </div>
            </div>
            <p v-else class="text-gray-400">No photos uploaded</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Location & Contact</h3>
            <p class="text-gray-600">{{ form.city }}, {{ form.country }}</p>
            <p v-if="form.phone" class="text-gray-600">Phone: {{ form.phone }}</p>
            <p v-if="form.email" class="text-gray-600">Email: {{ form.email }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-navy border border-gray-200 rounded-lg transition-colors"
        >
          Previous
        </button>
        <div v-else />

        <div class="flex gap-3">
          <button
            @click="saveDraft"
            :disabled="isSaving"
            class="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-navy border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            class="px-6 py-2.5 text-sm font-medium bg-orange hover:bg-orange-light text-white rounded-lg transition-colors"
          >
            Next
          </button>
          <button
            v-else
            @click="submitListing"
            :disabled="isSaving"
            class="px-6 py-2.5 text-sm font-medium bg-orange hover:bg-orange-light text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Publishing...' : 'Publish Listing' }}
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

const router = useRouter()
const { createListing, uploadImages } = useListings()

const currentStep = ref(0)
const isSaving = ref(false)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const stepErrors = reactive<Record<number, string>>({})

const steps = [
  { title: 'Category' },
  { title: 'Basic Info' },
  { title: 'Details' },
  { title: 'Description' },
  { title: 'Photos' },
  { title: 'Location' },
  { title: 'Review' },
]

const form = reactive({
  category: '',
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
  axles: null as number | null,
  wheelbase: '',
  color: '',
  description: '',
  country: '',
  city: '',
  phone: '',
  email: '',
  whatsapp: '',
})

const imageFiles = ref<File[]>([])
const imagePreviews = ref<{ file: File; preview: string }[]>([])

const categoryOptions = [
  { value: 'trucks', label: 'Trucks', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10' },
  { value: 'trailers', label: 'Trailers', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 13h18V7H3v6z' },
  { value: 'vans', label: 'Vans', icon: 'M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0zM14 6H3v11h1' },
  { value: 'equipment', label: 'Equipment', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35' },
  { value: 'parts', label: 'Parts', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3' },
  { value: 'cars', label: 'Cars', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 11l2-6h14l2 6M3 11h18v6H3v-6z' },
]

const validateStep = (step: number): boolean => {
  stepErrors[step] = ''
  switch (step) {
    case 0:
      if (!form.category) { stepErrors[0] = 'Please select a category'; return false }
      break
    case 1:
      if (!form.title) { stepErrors[1] = 'Title is required'; return false }
      if (!form.brand) { stepErrors[1] = 'Brand is required'; return false }
      if (!form.model) { stepErrors[1] = 'Model is required'; return false }
      if (!form.condition) { stepErrors[1] = 'Condition is required'; return false }
      if (!form.price) { stepErrors[1] = 'Price is required'; return false }
      break
    case 2:
      if (!form.year) { stepErrors[2] = 'Year is required'; return false }
      break
    case 5:
      if (!form.country) { stepErrors[5] = 'Country is required'; return false }
      if (!form.city) { stepErrors[5] = 'City is required'; return false }
      break
  }
  return true
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const goToStep = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'))
  addFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
  target.value = ''
}

const addFiles = (files: File[]) => {
  for (const file of files) {
    if (imagePreviews.value.length >= 20) break
    imageFiles.value.push(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push({ file, preview: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = (idx: number) => {
  imagePreviews.value.splice(idx, 1)
  imageFiles.value.splice(idx, 1)
}

const saveDraft = async () => {
  isSaving.value = true
  try {
    await createListing({ ...form, status: 'draft' })
    await router.push('/seller/listings')
  } catch {
    // Error handled in composable
  } finally {
    isSaving.value = false
  }
}

const submitListing = async () => {
  isSaving.value = true
  try {
    const listing = await createListing(form as unknown as Record<string, unknown>)
    if (imageFiles.value.length) {
      await uploadImages(listing.id, imageFiles.value)
    }
    await router.push('/seller/listings')
  } catch {
    // Error handled in composable
  } finally {
    isSaving.value = false
  }
}

useHead({
  title: 'Create New Listing - MenonTrucks',
})
</script>
