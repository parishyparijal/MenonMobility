export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser } = useAuth()

  if (!isAuthenticated.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
