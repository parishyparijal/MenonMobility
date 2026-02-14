<script setup lang="ts">
const currentYear = new Date().getFullYear()

const categories = [
  { label: 'Trucks', to: '/trucks' },
  { label: 'Trailers', to: '/trailers' },
  { label: 'Vans', to: '/vans' },
  { label: 'Equipment', to: '/equipment' },
  { label: 'Parts', to: '/parts' },
  { label: 'Cars', to: '/cars' },
]

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Careers', to: '/careers' },
  { label: 'Blog', to: '/blog' },
]

const supportLinks = [
  { label: 'Help Center', to: '/help' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Advertise', to: '/advertise' },
]
</script>

<template>
  <footer class="bg-[#1E2B47] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Column 1: Logo & Description -->
        <div>
          <NuxtLink to="/" class="inline-block mb-4">
            <span class="text-2xl font-bold">
              <span class="text-white">Menon</span><span class="text-[#FF6B35]">Trucks</span>
            </span>
          </NuxtLink>
          <p class="text-gray-400 text-sm leading-relaxed">
            Europe's leading commercial vehicle marketplace
          </p>
        </div>

        <!-- Column 2: Categories -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
            Categories
          </h3>
          <ul class="space-y-3">
            <li v-for="link in categories" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3: Company -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
            Company
          </h3>
          <ul class="space-y-3">
            <li v-for="link in companyLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 4: Support -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
            Support
          </h3>
          <ul class="space-y-3">
            <li v-for="link in supportLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p class="text-gray-400 text-sm">
            &copy; {{ currentYear }} MenonTrucks. All rights reserved.
          </p>

          <!-- Social Icons Placeholder -->
          <div class="flex items-center space-x-4">
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Facebook"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
