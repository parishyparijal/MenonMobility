<script setup lang="ts">
const route = useRoute()

const isMenuOpen = ref(false)
const isUserDropdownOpen = ref(false)

// Placeholder for auth composable
const isAuthenticated = ref(false)
const isSeller = ref(false)
const isAdmin = ref(false)
const userName = ref('')
const userInitial = computed(() => userName.value?.charAt(0)?.toUpperCase() || 'U')

const navLinks = [
  { label: 'Trucks', to: '/trucks' },
  { label: 'Trailers', to: '/trailers' },
  { label: 'Vans', to: '/vans' },
  { label: 'Equipment', to: '/equipment' },
  { label: 'Parts', to: '/parts' },
]

const dropdownItems = computed(() => {
  const items: Array<{ label: string; to: string; show: boolean }> = [
    { label: 'My Favorites', to: '/account/favorites', show: true },
    { label: 'My Messages', to: '/account/messages', show: isSeller.value },
    { label: 'Seller Dashboard', to: '/seller/dashboard', show: isSeller.value },
    { label: 'Admin Panel', to: '/admin', show: isAdmin.value },
  ]
  return items.filter((item) => item.show)
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function toggleUserDropdown() {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

function closeUserDropdown() {
  isUserDropdownOpen.value = false
}

function logout() {
  isAuthenticated.value = false
  isUserDropdownOpen.value = false
  navigateTo('/')
}

// Close dropdown on outside click
function onClickOutsideDropdown(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.user-dropdown-wrapper')) {
    closeUserDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutsideDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutsideDropdown)
})

// Close mobile menu on route change
watch(
  () => route.fullPath,
  () => {
    closeMenu()
    closeUserDropdown()
  }
)
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center flex-shrink-0">
          <span class="text-2xl font-bold">
            <span class="text-[#1E2B47]">Menon</span><span class="text-[#FF6B35]">Trucks</span>
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8" aria-label="Main navigation">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-[#1E2B47] hover:text-[#FF6B35] font-medium text-sm transition-colors duration-200"
            active-class="text-[#FF6B35]"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-3">
          <!-- Search Icon -->
          <button
            type="button"
            class="p-2 text-[#1E2B47] hover:text-[#FF6B35] transition-colors duration-200"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <!-- Auth Buttons (not authenticated) -->
          <template v-if="!isAuthenticated">
            <NuxtLink
              to="/login"
              class="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-[#1E2B47] hover:text-[#FF6B35] transition-colors duration-200"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#FF8C5E] rounded-lg transition-colors duration-200"
            >
              Register
            </NuxtLink>
          </template>

          <!-- User Dropdown (authenticated) -->
          <div v-else class="relative user-dropdown-wrapper">
            <button
              type="button"
              class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="User menu"
              aria-haspopup="true"
              :aria-expanded="isUserDropdownOpen"
              @click.stop="toggleUserDropdown"
            >
              <div
                class="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm font-semibold"
              >
                {{ userInitial }}
              </div>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isUserDropdownOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                role="menu"
              >
                <NuxtLink
                  v-for="item in dropdownItems"
                  :key="item.to"
                  :to="item.to"
                  class="block px-4 py-2 text-sm text-[#1E2B47] hover:bg-gray-50 transition-colors duration-200"
                  role="menuitem"
                  @click="closeUserDropdown"
                >
                  {{ item.label }}
                </NuxtLink>
                <hr class="my-1 border-gray-200" />
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
                  role="menuitem"
                  @click="logout"
                >
                  Logout
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile Hamburger -->
          <button
            type="button"
            class="md:hidden p-2 text-[#1E2B47] hover:text-[#FF6B35] transition-colors duration-200"
            aria-label="Open menu"
            @click="toggleMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Slide-out Drawer -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 z-40 md:hidden" @click="closeMenu">
        <div class="fixed inset-0 bg-black/50" aria-hidden="true" />
      </div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isMenuOpen"
        class="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-xl md:hidden overflow-y-auto"
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <span class="text-xl font-bold">
            <span class="text-[#1E2B47]">Menon</span><span class="text-[#FF6B35]">Trucks</span>
          </span>
          <button
            type="button"
            class="p-2 text-gray-500 hover:text-[#1E2B47]"
            aria-label="Close menu"
            @click="closeMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="p-4 space-y-1" aria-label="Mobile navigation">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-4 py-3 text-[#1E2B47] hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
            active-class="bg-gray-50 text-[#FF6B35]"
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="border-t border-gray-200 p-4">
          <template v-if="!isAuthenticated">
            <NuxtLink
              to="/login"
              class="block w-full text-center px-4 py-3 text-[#1E2B47] border border-gray-300 rounded-lg font-medium mb-2 hover:bg-gray-50 transition-colors duration-200"
              @click="closeMenu"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="block w-full text-center px-4 py-3 text-white bg-[#FF6B35] hover:bg-[#FF8C5E] rounded-lg font-medium transition-colors duration-200"
              @click="closeMenu"
            >
              Register
            </NuxtLink>
          </template>

          <template v-else>
            <NuxtLink
              v-for="item in dropdownItems"
              :key="item.to"
              :to="item.to"
              class="block px-4 py-3 text-[#1E2B47] hover:bg-gray-50 rounded-lg text-sm transition-colors duration-200"
              @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-lg text-sm mt-2 transition-colors duration-200"
              @click="logout"
            >
              Logout
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
