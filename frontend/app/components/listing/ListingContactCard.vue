<script setup lang="ts">
interface ListingContactData {
  price?: number | null
  price_on_request?: boolean
  seller_name?: string | null
  seller_slug?: string | null
  seller_verified?: boolean
  seller_member_since?: string | null
  seller_phone?: string | null
  seller_whatsapp?: string | null
}

const props = defineProps<{
  listing: ListingContactData
}>()

const emit = defineEmits<{
  (e: 'send-message'): void
  (e: 'toggle-favorite'): void
}>()

const isPhoneRevealed = ref(false)
const isFavorited = ref(false)

const formattedPrice = computed(() => {
  if (props.listing.price_on_request || !props.listing.price) {
    return null
  }
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.listing.price)
})

const maskedPhone = computed(() => {
  const phone = props.listing.seller_phone
  if (!phone) return null
  if (phone.length <= 6) return phone.replace(/./g, '*')
  return phone.slice(0, 4) + '****' + phone.slice(-2)
})

const whatsappLink = computed(() => {
  const phone = props.listing.seller_whatsapp || props.listing.seller_phone
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleaned}`
})

function revealPhone() {
  isPhoneRevealed.value = true
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
  emit('toggle-favorite')
}

function sendMessage() {
  emit('send-message')
}
</script>

<template>
  <div class="sticky top-20 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Price Section -->
    <div class="px-6 py-5">
      <p v-if="formattedPrice" class="text-3xl font-bold text-[#FF6B35]">
        {{ formattedPrice }}
      </p>
      <p v-else class="text-lg font-medium text-gray-500">
        Price on request
      </p>
    </div>

    <hr class="border-gray-200" />

    <!-- Seller Section -->
    <div class="px-6 py-5">
      <div class="flex items-center space-x-2 mb-2">
        <NuxtLink
          v-if="listing.seller_slug"
          :to="`/sellers/${listing.seller_slug}`"
          class="text-[#1E2B47] font-semibold hover:text-[#FF6B35] transition-colors duration-200"
        >
          {{ listing.seller_name || 'Unknown Seller' }}
        </NuxtLink>
        <span v-else class="text-[#1E2B47] font-semibold">
          {{ listing.seller_name || 'Unknown Seller' }}
        </span>

        <!-- Verified Badge -->
        <span
          v-if="listing.seller_verified"
          class="inline-flex items-center text-blue-500"
          title="Verified Seller"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>

      <p v-if="listing.seller_member_since" class="text-xs text-gray-400">
        Member since {{ listing.seller_member_since }}
      </p>
    </div>

    <!-- Contact Buttons -->
    <div class="px-6 pb-6 space-y-3">
      <!-- Show Phone Number -->
      <button
        v-if="listing.seller_phone"
        type="button"
        class="w-full flex items-center justify-center px-4 py-3 border-2 border-[#1E2B47] text-[#1E2B47] font-medium rounded-lg hover:bg-[#1E2B47] hover:text-white transition-colors duration-200 text-sm"
        @click="revealPhone"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        <span v-if="isPhoneRevealed">{{ listing.seller_phone }}</span>
        <span v-else>Show Phone Number {{ maskedPhone ? `(${maskedPhone})` : '' }}</span>
      </button>

      <!-- WhatsApp -->
      <a
        v-if="whatsappLink"
        :href="whatsappLink"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full flex items-center justify-center px-4 py-3 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20BD5A] transition-colors duration-200 text-sm"
        aria-label="Contact via WhatsApp"
      >
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
        WhatsApp
      </a>

      <!-- Send Message -->
      <button
        type="button"
        class="w-full flex items-center justify-center px-4 py-3 bg-[#FF6B35] text-white font-medium rounded-lg hover:bg-[#FF8C5E] transition-colors duration-200 text-sm"
        @click="sendMessage"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Send Message
      </button>

      <!-- Favorite Button -->
      <button
        type="button"
        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
        @click="toggleFavorite"
      >
        <svg
          class="w-5 h-5 mr-2 transition-colors duration-200"
          :class="isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            :fill="isFavorited ? 'currentColor' : 'none'"
          />
        </svg>
        {{ isFavorited ? 'Saved to Favorites' : 'Save to Favorites' }}
      </button>
    </div>
  </div>
</template>
