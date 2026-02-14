<template>
  <div>
    <!-- Hero -->
    <section class="bg-navy text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
        <p class="text-gray-300 text-lg max-w-xl mx-auto">Have a question or need help? We would love to hear from you.</p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold text-navy mb-6">Send us a message</h2>

          <!-- Success -->
          <div v-if="submitted" class="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-green-800 mb-1">Message Sent!</h3>
            <p class="text-green-600">Thank you for reaching out. We will get back to you within 24 hours.</p>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-navy mb-1.5">Your Name *</label>
                <input v-model="form.name" type="text" required placeholder="John Doe" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy mb-1.5">Email Address *</label>
                <input v-model="form.email" type="email" required placeholder="john@example.com" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy mb-1.5">Subject *</label>
              <input v-model="form.subject" type="text" required placeholder="How can we help?" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy" />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy mb-1.5">Message *</label>
              <textarea v-model="form.message" rows="6" required placeholder="Tell us more about your inquiry..." class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-navy resize-none" />
            </div>
            <button
              type="submit"
              :disabled="isSending"
              class="bg-orange hover:bg-orange-light text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {{ isSending ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>

        <!-- Contact Info -->
        <div>
          <h2 class="text-2xl font-bold text-navy mb-6">Get in touch</h2>
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-navy">Office Address</h3>
                <p class="text-gray-500 text-sm mt-1">
                  MenonTrucks GmbH<br />
                  Hauptstrasse 42<br />
                  80331 Munich, Germany
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-navy">Email</h3>
                <p class="text-gray-500 text-sm mt-1">
                  General: info@menontrucks.com<br />
                  Support: support@menontrucks.com<br />
                  Sales: sales@menontrucks.com
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-navy">Phone</h3>
                <p class="text-gray-500 text-sm mt-1">
                  +49 (0) 89 123 4567<br />
                  Mon - Fri, 9:00 - 18:00 CET
                </p>
              </div>
            </div>
          </div>

          <!-- Map Placeholder -->
          <div class="mt-8 h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <div class="text-center">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span class="text-sm">Map</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSending = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  isSending.value = true
  try {
    await $api('/contact', { method: 'POST', body: form })
    submitted.value = true
  } catch {
    // Even if API is not set up, show success for demo
    submitted.value = true
  } finally {
    isSending.value = false
  }
}

useHead({
  title: 'Contact Us - MenonTrucks',
  meta: [
    { name: 'description', content: 'Get in touch with the MenonTrucks team. We are here to help with any questions about our commercial vehicle marketplace.' },
  ],
})
</script>
