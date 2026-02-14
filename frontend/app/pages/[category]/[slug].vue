<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-orange transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink :to="`/${route.params.category}`" class="hover:text-orange transition-colors capitalize">{{ listing?.category?.name || route.params.category }}</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-navy font-medium line-clamp-1">{{ listing?.title || 'Loading...' }}</span>
      </nav>

      <!-- Loading -->
      <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3 space-y-4">
          <div class="bg-gray-200 rounded-xl h-96 animate-pulse" />
          <div class="flex gap-2">
            <div v-for="i in 5" :key="i" class="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl p-6 space-y-4 animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-1/2" />
            <div class="h-6 bg-gray-200 rounded w-3/4" />
            <div class="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-2.694-.834-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-xl font-semibold text-navy mb-2">Listing not found</h3>
        <p class="text-gray-500 mb-6">This listing may have been removed or is no longer available.</p>
        <NuxtLink to="/search" class="bg-orange hover:bg-orange-light text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          Browse Listings
        </NuxtLink>
      </div>

      <!-- Content -->
      <div v-else-if="listing" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Left Column: Images + Details -->
        <div class="lg:col-span-3">
          <!-- Image Gallery -->
          <div class="bg-white rounded-xl overflow-hidden mb-6">
            <!-- Main Image -->
            <div
              class="relative h-72 sm:h-96 bg-gray-100 cursor-pointer"
              @click="showLightbox = true"
            >
              <img
                v-if="listing.images.length"
                :src="listing.images[activeImage]?.url"
                :alt="listing.title"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div v-if="listing.images.length > 1" class="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {{ activeImage + 1 }} / {{ listing.images.length }}
              </div>
            </div>
            <!-- Thumbnails -->
            <div v-if="listing.images.length > 1" class="flex gap-2 p-4 overflow-x-auto">
              <button
                v-for="(img, idx) in listing.images"
                :key="img.id"
                @click="activeImage = idx"
                :class="[
                  'w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                  activeImage === idx ? 'border-orange' : 'border-transparent hover:border-gray-300',
                ]"
              >
                <img :src="img.thumbnail" :alt="`${listing.title} ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Lightbox -->
          <Teleport to="body">
            <div v-if="showLightbox && listing.images.length" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" @click.self="showLightbox = false">
              <button @click="showLightbox = false" class="absolute top-4 right-4 text-white hover:text-orange z-10">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <button v-if="activeImage > 0" @click="activeImage--" class="absolute left-4 text-white hover:text-orange">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <img :src="listing.images[activeImage]?.url" :alt="listing.title" class="max-w-full max-h-[90vh] object-contain" />
              <button v-if="activeImage < listing.images.length - 1" @click="activeImage++" class="absolute right-4 text-white hover:text-orange">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </Teleport>

          <!-- Description -->
          <div class="bg-white rounded-xl p-6 mb-6">
            <h2 class="text-lg font-bold text-navy mb-4">Description</h2>
            <div class="text-gray-600 leading-relaxed whitespace-pre-line">{{ listing.description }}</div>
          </div>

          <!-- Specifications -->
          <div class="bg-white rounded-xl p-6 mb-6">
            <h2 class="text-lg font-bold text-navy mb-4">Specifications</h2>

            <!-- General -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">General</h3>
              <div class="grid grid-cols-2 gap-x-8 gap-y-3">
                <div class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Brand</span>
                  <span class="text-sm font-medium text-navy">{{ listing.brand.name }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Model</span>
                  <span class="text-sm font-medium text-navy">{{ listing.model }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Year</span>
                  <span class="text-sm font-medium text-navy">{{ listing.year }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Condition</span>
                  <span class="text-sm font-medium text-navy capitalize">{{ listing.condition }}</span>
                </div>
                <div v-if="listing.color" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Color</span>
                  <span class="text-sm font-medium text-navy">{{ listing.color }}</span>
                </div>
                <div v-if="listing.mileage" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Mileage</span>
                  <span class="text-sm font-medium text-navy">{{ listing.mileage.toLocaleString() }} km</span>
                </div>
              </div>
            </div>

            <!-- Engine -->
            <div v-if="listing.fuel_type || listing.transmission || listing.engine_power" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Engine</h3>
              <div class="grid grid-cols-2 gap-x-8 gap-y-3">
                <div v-if="listing.fuel_type" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Fuel Type</span>
                  <span class="text-sm font-medium text-navy capitalize">{{ listing.fuel_type }}</span>
                </div>
                <div v-if="listing.transmission" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Transmission</span>
                  <span class="text-sm font-medium text-navy capitalize">{{ listing.transmission }}</span>
                </div>
                <div v-if="listing.engine_power" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Engine Power</span>
                  <span class="text-sm font-medium text-navy">{{ listing.engine_power }}</span>
                </div>
              </div>
            </div>

            <!-- Dimensions -->
            <div v-if="listing.gvw || listing.axles || listing.wheelbase" class="mb-2">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Dimensions</h3>
              <div class="grid grid-cols-2 gap-x-8 gap-y-3">
                <div v-if="listing.gvw" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">GVW</span>
                  <span class="text-sm font-medium text-navy">{{ listing.gvw.toLocaleString() }} kg</span>
                </div>
                <div v-if="listing.axles" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Axles</span>
                  <span class="text-sm font-medium text-navy">{{ listing.axles }}</span>
                </div>
                <div v-if="listing.wheelbase" class="flex justify-between border-b border-gray-100 pb-2">
                  <span class="text-sm text-gray-500">Wheelbase</span>
                  <span class="text-sm font-medium text-navy">{{ listing.wheelbase }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div v-if="listing.features?.length" class="bg-white rounded-xl p-6 mb-6">
            <h2 class="text-lg font-bold text-navy mb-4">Features</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="feature in listing.features" :key="feature" class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-700">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-xl p-6 mb-6">
            <h2 class="text-lg font-bold text-navy mb-4">Location</h2>
            <div class="flex items-center gap-2 text-gray-600 mb-4">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ listing.location }}, {{ listing.country }}</span>
            </div>
            <!-- Map Placeholder -->
            <div class="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <div class="text-center">
                <svg class="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span class="text-sm">Map view</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Price + Seller -->
        <div class="lg:col-span-2">
          <div class="sticky top-24 space-y-6">
            <!-- Price Card -->
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <h1 class="text-xl font-bold text-navy mb-2 leading-tight">{{ listing.title }}</h1>
              <p class="text-3xl font-bold text-orange mb-4">
                {{ listing.currency }} {{ listing.price.toLocaleString() }}
              </p>
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span class="capitalize">{{ listing.condition }}</span>
                <span>&middot;</span>
                <span>{{ listing.year }}</span>
                <span v-if="listing.mileage">&middot;</span>
                <span v-if="listing.mileage">{{ listing.mileage.toLocaleString() }} km</span>
              </div>

              <!-- Favorite -->
              <button
                @click="handleFavorite"
                :class="[
                  'w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold transition-colors mb-4',
                  isFav
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-600 hover:border-orange hover:text-orange',
                ]"
              >
                <svg class="w-5 h-5" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isFav ? 'Saved' : 'Save to Favorites' }}
              </button>

              <div class="text-xs text-gray-400 flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {{ listing.views_count }} views
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {{ listing.favorites_count }} saved
                </span>
              </div>
            </div>

            <!-- Seller Card -->
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img v-if="listing.seller.avatar" :src="listing.seller.avatar" :alt="listing.seller.name" class="w-full h-full object-cover" />
                  <span v-else class="text-lg font-bold text-navy">{{ listing.seller.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <NuxtLink :to="`/sellers/${listing.seller.id}`" class="font-semibold text-navy hover:text-orange transition-colors">
                      {{ listing.seller.company || listing.seller.name }}
                    </NuxtLink>
                    <span v-if="listing.seller.verified" class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                      Verified
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">{{ listing.seller.name }}</p>
                </div>
              </div>

              <!-- Contact Buttons -->
              <div class="space-y-3">
                <a
                  v-if="listing.seller.phone"
                  :href="`tel:${listing.seller.phone}`"
                  class="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Seller
                </a>
                <a
                  v-if="listing.seller.phone"
                  :href="`https://wa.me/${listing.seller.phone.replace(/[^0-9]/g, '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  v-if="listing.seller.email"
                  :href="`mailto:${listing.seller.email}?subject=Inquiry about: ${listing.title}`"
                  class="w-full flex items-center justify-center gap-2 bg-orange hover:bg-orange-light text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Listings -->
      <div v-if="relatedListings.length" class="mt-12">
        <h2 class="text-2xl font-bold text-navy mb-6">Related Listings</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="related in relatedListings"
            :key="related.id"
            :to="`/${related.category.slug}/${related.slug}`"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img v-if="related.images.length" :src="related.images[0].thumbnail" :alt="related.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span class="absolute top-3 right-3 bg-white/90 text-navy text-xs font-semibold px-2 py-1 rounded-full capitalize">{{ related.condition }}</span>
            </div>
            <div class="p-4">
              <p class="text-xs text-gray-500 mb-1">{{ related.brand.name }} &middot; {{ related.year }}</p>
              <h3 class="font-semibold text-navy text-sm line-clamp-2 mb-2">{{ related.title }}</h3>
              <p class="text-orange font-bold">{{ related.currency }} {{ related.price.toLocaleString() }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $api } = useNuxtApp()
const { fetchListing, fetchListings } = useListings()
const { isFavorite, toggleFavorite } = useFavorites()
const { isAuthenticated } = useAuth()

const activeImage = ref(0)
const showLightbox = ref(false)
const relatedListings = ref<any[]>([])

// SSR fetch listing
const { data: listing, pending, error } = await useAsyncData(
  `listing-${route.params.slug}`,
  () => fetchListing(String(route.params.slug)),
)

const isFav = computed(() => listing.value ? isFavorite(listing.value.id) : false)

const handleFavorite = async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/login')
    return
  }
  if (listing.value) {
    await toggleFavorite(listing.value.id)
  }
}

// Fetch related listings
onMounted(async () => {
  if (listing.value) {
    try {
      const res = await fetchListings({
        category: listing.value.category.slug,
        per_page: 4,
        exclude: listing.value.id,
      })
      relatedListings.value = res.data
    } catch {
      relatedListings.value = []
    }
  }
})

// SEO
useHead({
  title: computed(() => listing.value ? `${listing.value.title} - MenonTrucks` : 'Loading... - MenonTrucks'),
  meta: [
    { name: 'description', content: computed(() => listing.value?.description?.substring(0, 160) || '') as unknown as string },
    { property: 'og:title', content: computed(() => listing.value?.title || '') as unknown as string },
    { property: 'og:description', content: computed(() => listing.value?.description?.substring(0, 160) || '') as unknown as string },
    { property: 'og:image', content: computed(() => listing.value?.images?.[0]?.url || '') as unknown as string },
    { property: 'og:type', content: 'product' },
  ],
})
</script>
