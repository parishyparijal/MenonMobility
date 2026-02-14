<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center space-x-1">
          <span class="text-3xl font-bold text-navy">Menon</span>
          <span class="text-3xl font-bold text-orange">Trucks</span>
        </NuxtLink>
        <p class="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
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
          <div class="flex items-center justify-between mb-1.5">
            <label for="password" class="block text-sm font-medium text-navy">Password</label>
            <NuxtLink to="/forgot-password" class="text-sm text-orange hover:text-orange-light transition-colors">
              Forgot password?
            </NuxtLink>
          </div>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors text-navy placeholder-gray-400"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
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
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <!-- Register Link -->
      <p class="text-center text-gray-500 text-sm mt-6">
        Don't have an account?
        <NuxtLink to="/register" class="text-orange hover:text-orange-light font-semibold transition-colors">
          Register
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

const { login, isLoading } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')

const validate = (): boolean => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }
  return true
}

const handleLogin = async () => {
  errorMessage.value = ''
  if (!validate()) return

  try {
    await login(form.email, form.password)
    await router.push('/')
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Invalid email or password. Please try again.'
  }
}

useHead({
  title: 'Login - MenonTrucks',
})
</script>
