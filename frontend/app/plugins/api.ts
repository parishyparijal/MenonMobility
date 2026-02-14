export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authToken = useCookie('auth_token')

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,

    onRequest({ options }) {
      if (authToken.value) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${authToken.value}`)
        options.headers = headers
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        authToken.value = null
        await navigateTo('/login')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
