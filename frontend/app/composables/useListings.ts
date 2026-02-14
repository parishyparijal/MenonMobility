interface Listing {
  id: number
  title: string
  slug: string
  description: string
  price: number
  currency: string
  year: number
  condition: 'new' | 'used' | 'certified'
  mileage?: number
  fuel_type?: string
  transmission?: string
  engine_power?: string
  gvw?: number
  axles?: number
  wheelbase?: string
  color?: string
  brand: { id: number; name: string; slug: string }
  model: string
  category: { id: number; name: string; slug: string }
  location: string
  country: string
  latitude?: number
  longitude?: number
  features: string[]
  images: ListingImage[]
  seller: {
    id: number
    name: string
    email: string
    phone?: string
    company?: string
    avatar?: string
    verified: boolean
  }
  views_count: number
  favorites_count: number
  status: 'draft' | 'active' | 'sold' | 'expired'
  is_featured: boolean
  created_at: string
  updated_at: string
}

interface ListingImage {
  id: number
  url: string
  thumbnail: string
  position: number
}

interface ListingsResponse {
  data: Listing[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const useListings = () => {
  const { $api } = useNuxtApp()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchListing = async (slug: string): Promise<Listing> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $api<{ data: Listing }>(`/listings/${slug}`)
      return response.data
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to load listing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchListings = async (params?: Record<string, unknown>): Promise<ListingsResponse> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $api<ListingsResponse>('/listings', { params })
      return response
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to load listings'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createListing = async (data: Record<string, unknown>): Promise<Listing> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $api<{ data: Listing }>('/seller/listings', {
        method: 'POST',
        body: data,
      })
      return response.data
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to create listing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateListing = async (id: number, data: Record<string, unknown>): Promise<Listing> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $api<{ data: Listing }>(`/seller/listings/${id}`, {
        method: 'PUT',
        body: data,
      })
      return response.data
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to update listing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteListing = async (id: number): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      await $api(`/seller/listings/${id}`, { method: 'DELETE' })
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to delete listing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const uploadImages = async (listingId: number, files: File[]): Promise<ListingImage[]> => {
    isLoading.value = true
    error.value = null
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('images[]', file)
      })
      const response = await $api<{ data: ListingImage[] }>(
        `/seller/listings/${listingId}/images`,
        {
          method: 'POST',
          body: formData,
        },
      )
      return response.data
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to upload images'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteImage = async (imageId: number): Promise<void> => {
    try {
      await $api(`/seller/images/${imageId}`, { method: 'DELETE' })
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to delete image'
      throw err
    }
  }

  const reorderImages = async (listingId: number, imageIds: number[]): Promise<void> => {
    try {
      await $api(`/seller/listings/${listingId}/images/reorder`, {
        method: 'PUT',
        body: { image_ids: imageIds },
      })
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError?.data?.message || 'Failed to reorder images'
      throw err
    }
  }

  return {
    isLoading,
    error,
    fetchListing,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    uploadImages,
    deleteImage,
    reorderImages,
  }
}

export type { Listing, ListingImage, ListingsResponse }
