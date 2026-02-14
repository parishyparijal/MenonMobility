<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center space-x-1">
          <span class="text-3xl font-bold text-navy">Menon</span>
          <span class="text-3xl font-bold text-orange">Trucks</span>
        </NuxtLink>
        <p class="text-gray-500 mt-2">Create your account</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-medium text-navy mb-1.5">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            placeholder="John Doe"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors text-navy placeholder-gray-400"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-navy mb-1.5">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors text-navy placeholder-gray-400"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-navy mb-1.5">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            placeholder="At least 8 characters"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors text-navy placeholder-gray-400"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <div>
          <label for="password_confirm" class="block text-sm font-medium text-navy mb-1.5">Confirm Password</label>
          <input
            id="password_confirm"
            v-model="form.passwordConfirm"
            type="password"
            required
            autocomplete="new-password"
            placeholder="Repeat your password"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors text-navy placeholder-gray-400"
          />
          <p v-if="errors.passwordConfirm" class="mt-1 text-xs text-red-500">{{ errors.passwordConfirm }}</p>
        </div>

        <!-- Account Type -->
        <div>
          <label class="block text-sm font-medium text-navy mb-3">I want to...</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.accountType = 'buyer'"
              :class="[
                'p-4 rounded-xl border-2 text-center transition-colors',
                form.accountType === 'buyer'
                  ? 'border-orange bg-orange-lighter text-orange'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600',
              ]"
            >
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="font-semibold text-sm">Buy Vehicles</span>
            </button>
            <button
              type="button"
              @click="form.accountType = 'seller'"
              :class="[
                'p-4 rounded-xl border-2 text-center transition-colors',
                form.accountType === 'seller'
                  ? 'border-orange bg-orange-lighter text-orange'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600',
              ]"
            >
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="font-semibold text-sm">List Vehicles</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-orange hover:bg-orange-light text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="inline-flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <!-- Login Link -->
      <p class="text-center text-gray-500 text-sm mt-6">
        Already have an account?
        <NuxtLink to="/login" class="text-orange hover:text-orange-light font-semibold transition-colors">
          Login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { register, isLoading } = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  accountType: 'buyer' as 'buyer' | 'seller',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const errorMessage = ref('')

const validate = (): boolean => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.passwordConfirm = ''

  let valid = true

  if (!form.name.trim()) {
    errors.name = 'Name is required'
    valid = false
  }
  if (!form.email) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    valid = false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    valid = false
  }
  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = 'Passwords do not match'
    valid = false
  }

  return valid
}

const handleRegister = async () => {
  errorMessage.value = ''
  if (!validate()) return

  try {
    await register(form.name, form.email, form.password)
    await router.push('/')
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Registration failed. Please try again.'
  }
}

useHead({
  title: 'Register - MenonTrucks',
})
</script>
