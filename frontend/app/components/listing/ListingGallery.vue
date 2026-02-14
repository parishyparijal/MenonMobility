<script setup lang="ts">
interface GalleryImage {
  id: number | string
  thumbnail_url: string
  large_url: string
  webp_url?: string
  alt_text?: string
}

const props = defineProps<{
  images: GalleryImage[]
}>()

const selectedIndex = ref(0)
const isLightboxOpen = ref(false)
const thumbnailContainer = ref<HTMLElement | null>(null)

const selectedImage = computed(() => props.images[selectedIndex.value] || null)

const imageCounter = computed(() => {
  return `${selectedIndex.value + 1} / ${props.images.length}`
})

function selectImage(index: number) {
  selectedIndex.value = index
}

function openLightbox() {
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
}

function nextImage() {
  if (selectedIndex.value < props.images.length - 1) {
    selectedIndex.value++
  } else {
    selectedIndex.value = 0
  }
  scrollThumbnailIntoView()
}

function prevImage() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  } else {
    selectedIndex.value = props.images.length - 1
  }
  scrollThumbnailIntoView()
}

function scrollThumbnailIntoView() {
  nextTick(() => {
    const container = thumbnailContainer.value
    if (!container) return
    const activeThumb = container.children[selectedIndex.value] as HTMLElement
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  })
}

function onKeydown(event: KeyboardEvent) {
  if (!isLightboxOpen.value) return
  if (event.key === 'ArrowLeft') {
    prevImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  } else if (event.key === 'Escape') {
    closeLightbox()
  }
}

// Lock body scroll when lightbox is open
watch(isLightboxOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="images.length > 0">
    <!-- Main Image -->
    <div
      class="relative w-full aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
      @click="openLightbox"
    >
      <img
        v-if="selectedImage"
        :src="selectedImage.large_url"
        :alt="selectedImage.alt_text || 'Listing image'"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center"
      >
        <svg
          class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </div>

      <!-- Image Counter -->
      <span class="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
        {{ imageCounter }}
      </span>
    </div>

    <!-- Thumbnail Strip -->
    <div
      v-if="images.length > 1"
      ref="thumbnailContainer"
      class="flex space-x-2 mt-3 overflow-x-auto pb-2 scrollbar-thin"
    >
      <button
        v-for="(image, index) in images"
        :key="image.id"
        type="button"
        class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200"
        :class="index === selectedIndex
          ? 'border-[#FF6B35] opacity-100'
          : 'border-transparent opacity-60 hover:opacity-100'"
        :aria-label="`View image ${index + 1}`"
        @click="selectImage(index)"
      >
        <img
          :src="image.thumbnail_url"
          :alt="image.alt_text || `Thumbnail ${index + 1}`"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isLightboxOpen"
          class="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors duration-200"
            aria-label="Close lightbox"
            @click="closeLightbox"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image Counter -->
          <span class="absolute top-4 left-4 z-10 text-white/80 text-sm font-medium">
            {{ imageCounter }}
          </span>

          <!-- Previous Arrow -->
          <button
            v-if="images.length > 1"
            type="button"
            class="absolute left-4 z-10 p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all duration-200"
            aria-label="Previous image"
            @click="prevImage"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Main Lightbox Image -->
          <img
            v-if="selectedImage"
            :src="selectedImage.large_url"
            :alt="selectedImage.alt_text || 'Listing image'"
            class="max-w-full max-h-full object-contain p-4"
          />

          <!-- Next Arrow -->
          <button
            v-if="images.length > 1"
            type="button"
            class="absolute right-4 z-10 p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all duration-200"
            aria-label="Next image"
            @click="nextImage"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
