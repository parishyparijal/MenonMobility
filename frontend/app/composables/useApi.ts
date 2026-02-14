interface ApiResponse<T> {
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const useApi = () => {
  const { $api } = useNuxtApp()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const request = async <T>(
    method: string,
    url: string,
    body?: Record<string, unknown>,
    params?: Record<string, unknown>,
  ): Promise<T> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $api<T>(url, {
        method,
        body,
        params,
      })
      return response
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string }; message?: string }
      error.value = fetchError?.data?.message || fetchError?.message || 'An error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const get = <T>(url: string, params?: Record<string, unknown>) =>
    request<T>('GET', url, undefined, params)

  const post = <T>(url: string, body?: Record<string, unknown>) =>
    request<T>('POST', url, body)

  const put = <T>(url: string, body?: Record<string, unknown>) =>
    request<T>('PUT', url, body)

  const del = <T>(url: string) =>
    request<T>('DELETE', url)

  return {
    isLoading,
    error,
    get,
    post,
    put,
    delete: del,
  }
}

export type { ApiResponse, PaginatedResponse }
