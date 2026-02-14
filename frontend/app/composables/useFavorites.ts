interface FavoriteListing {
  id: number
  title: string
  slug: string
  price: number
  currency: string
  year: number
  condition: string
  brand: string
  model: string
  category: string
  location: string
  images: { url: string; thumbnail: string }[]
  created_at: string
}

export const useFavorites = () => {
  const { $api } = useNuxtApp()
  const favorites = ref<FavoriteListing[]>([])
  const favoriteIds = ref<Set<number>>(new Set())
  const isLoading = ref(false)

  const isFavorite = (listingId: number): boolean => {
    return favoriteIds.value.has(listingId)
  }

  const toggleFavorite = async (listingId: number) => {
    const wasInFavorites = favoriteIds.value.has(listingId)

    // Optimistic update
    if (wasInFavorites) {
      favoriteIds.value.delete(listingId)
      favorites.value = favorites.value.filter((f) => f.id !== listingId)
    } else {
      favoriteIds.value.add(listingId)
    }

    try {
      await $api(`/favorites/${listingId}`, {
        method: wasInFavorites ? 'DELETE' : 'POST',
      })
    } catch {
      // Rollback on error
      if (wasInFavorites) {
        favoriteIds.value.add(listingId)
      } else {
        favoriteIds.value.delete(listingId)
      }
    }
  }

  const fetchFavorites = async () => {
    isLoading.value = true
    try {
      const response = await $api<{ data: FavoriteListing[] }>('/favorites')
      favorites.value = response.data
      favoriteIds.value = new Set(response.data.map((f) => f.id))
    } catch {
      favorites.value = []
      favoriteIds.value = new Set()
    } finally {
      isLoading.value = false
    }
  }

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    fetchFavorites,
  }
}
