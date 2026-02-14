<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 bg-navy shadow-lg">
      <div class="container mx-auto">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-1">
            <span class="text-2xl font-bold text-white">Menon</span>
            <span class="text-2xl font-bold text-orange">Trucks</span>
          </NuxtLink>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink
              to="/trucks"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
            >
              Trucks
            </NuxtLink>
            <NuxtLink
              to="/trailers"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
            >
              Trailers
            </NuxtLink>
            <NuxtLink
              to="/equipment"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
            >
              Equipment
            </NuxtLink>
            <NuxtLink
              to="/parts"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
            >
              Parts
            </NuxtLink>
          </nav>

          <!-- Right side -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Search Button -->
            <NuxtLink
              to="/search"
              class="text-gray-300 hover:text-orange transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </NuxtLink>

            <!-- Auth Buttons / User Dropdown -->
            <template v-if="isAuthenticated">
              <div class="relative" ref="dropdownRef">
                <button
                  @click="showDropdown = !showDropdown"
                  class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div class="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-semibold text-sm">
                    {{ user?.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <span class="font-medium">{{ user?.name }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown -->
                <div
                  v-if="showDropdown"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                >
                  <NuxtLink
                    to="/seller/dashboard"
                    v-if="isSeller"
                    class="block px-4 py-2 text-gray-700 hover:bg-orange-lighter hover:text-orange transition-colors"
                    @click="showDropdown = false"
                  >
                    Seller Dashboard
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/dashboard"
                    v-if="isAdmin"
                    class="block px-4 py-2 text-gray-700 hover:bg-orange-lighter hover:text-orange transition-colors"
                    @click="showDropdown = false"
                  >
                    Admin Panel
                  </NuxtLink>
                  <NuxtLink
                    to="/favorites"
                    class="block px-4 py-2 text-gray-700 hover:bg-orange-lighter hover:text-orange transition-colors"
                    @click="showDropdown = false"
                  >
                    My Favorites
                  </NuxtLink>
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-gray-700 hover:bg-orange-lighter hover:text-orange transition-colors"
                    @click="showDropdown = false"
                  >
                    Profile
                  </NuxtLink>
                  <hr class="my-1 border-gray-100" />
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="bg-orange hover:bg-orange-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </NuxtLink>
            </template>
          </div>

          <!-- Mobile Hamburger -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden text-gray-300 hover:text-white"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-navy-light mt-2 pt-4">
          <nav class="flex flex-col space-y-3">
            <NuxtLink
              to="/trucks"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
              @click="mobileMenuOpen = false"
            >
              Trucks
            </NuxtLink>
            <NuxtLink
              to="/trailers"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
              @click="mobileMenuOpen = false"
            >
              Trailers
            </NuxtLink>
            <NuxtLink
              to="/equipment"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
              @click="mobileMenuOpen = false"
            >
              Equipment
            </NuxtLink>
            <NuxtLink
              to="/parts"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
              @click="mobileMenuOpen = false"
            >
              Parts
            </NuxtLink>
            <NuxtLink
              to="/search"
              class="text-gray-300 hover:text-orange transition-colors font-medium"
              @click="mobileMenuOpen = false"
            >
              Search
            </NuxtLink>
            <hr class="border-navy-light" />
            <template v-if="isAuthenticated">
              <NuxtLink
                to="/seller/dashboard"
                v-if="isSeller"
                class="text-gray-300 hover:text-orange transition-colors font-medium"
                @click="mobileMenuOpen = false"
              >
                Seller Dashboard
              </NuxtLink>
              <NuxtLink
                to="/favorites"
                class="text-gray-300 hover:text-orange transition-colors font-medium"
                @click="mobileMenuOpen = false"
              >
                My Favorites
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="text-gray-300 hover:text-orange transition-colors font-medium"
                @click="mobileMenuOpen = false"
              >
                Profile
              </NuxtLink>
              <button
                @click="handleLogout"
                class="text-left text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-gray-300 hover:text-white transition-colors font-medium"
                @click="mobileMenuOpen = false"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="bg-orange hover:bg-orange-light text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                @click="mobileMenuOpen = false"
              >
                Register
              </NuxtLink>
            </template>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-navy text-gray-400">
      <div class="container mx-auto py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo & Description -->
          <div class="md:col-span-1">
            <NuxtLink to="/" class="flex items-center space-x-1 mb-4">
              <span class="text-xl font-bold text-white">Menon</span>
              <span class="text-xl font-bold text-orange">Trucks</span>
            </NuxtLink>
            <p class="text-sm leading-relaxed">
              The leading commercial vehicle marketplace. Buy and sell trucks, trailers, equipment, and parts from trusted dealers worldwide.
            </p>
          </div>

          <!-- Categories -->
          <div>
            <h4 class="text-white font-semibold mb-4">Categories</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/trucks" class="hover:text-orange transition-colors">Trucks</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/trailers" class="hover:text-orange transition-colors">Trailers</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/equipment" class="hover:text-orange transition-colors">Equipment</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/parts" class="hover:text-orange transition-colors">Parts & Accessories</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-white font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/about" class="hover:text-orange transition-colors">About Us</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/careers" class="hover:text-orange transition-colors">Careers</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/blog" class="hover:text-orange transition-colors">Blog</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/press" class="hover:text-orange transition-colors">Press</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-white font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/help" class="hover:text-orange transition-colors">Help Center</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="hover:text-orange transition-colors">Contact Us</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms" class="hover:text-orange transition-colors">Terms of Service</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/privacy" class="hover:text-orange transition-colors">Privacy Policy</NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <hr class="border-navy-light my-8" />

        <div class="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} MenonTrucks. All rights reserved.</p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" class="hover:text-orange transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="hover:text-orange transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            </a>
            <a href="#" class="hover:text-orange transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.778-.773 1.778-1.729v-20.542c0-.955-.8-1.729-1.778-1.729z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth()
const mobileMenuOpen = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleLogout = async () => {
  showDropdown.value = false
  mobileMenuOpen.value = false
  await logout()
}

// Close dropdown when clicking outside
if (import.meta.client) {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      showDropdown.value = false
    }
  }
  onMounted(() => document.addEventListener('click', handleClickOutside))
  onUnmounted(() => document.removeEventListener('click', handleClickOutside))
}
</script>
