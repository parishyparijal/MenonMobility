interface User {
  id: number
  name: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  avatar?: string
  phone?: string
  company?: string
  created_at: string
}

interface LoginResponse {
  token: string
  user: User
}

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = ref(false)
  const authToken = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  })

  const { $api } = useNuxtApp()

  const isAuthenticated = computed(() => !!user.value)
  const isSeller = computed(() => user.value?.role === 'seller' || user.value?.role === 'admin')
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      authToken.value = response.token
      user.value = response.user
      return response
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $api<LoginResponse>('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })
      authToken.value = response.token
      user.value = response.user
      return response
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await $api('/auth/logout', { method: 'POST' })
    } catch {
      // Ignore logout errors
    } finally {
      authToken.value = null
      user.value = null
      await navigateTo('/')
    }
  }

  const fetchUser = async () => {
    if (!authToken.value) return null
    isLoading.value = true
    try {
      const response = await $api<User>('/auth/user')
      user.value = response
      return response
    } catch {
      authToken.value = null
      user.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isSeller,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
  }
}
