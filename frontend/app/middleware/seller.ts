export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, isSeller, fetchUser } = useAuth()

  if (!isAuthenticated.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isSeller.value) {
    return navigateTo('/')
  }
})
