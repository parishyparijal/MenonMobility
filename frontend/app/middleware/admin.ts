export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, isAdmin, fetchUser } = useAuth()

  if (!isAuthenticated.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
