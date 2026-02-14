interface SearchFilters {
  category: string
  brand: string
  model: string
  minPrice: number | null
  maxPrice: number | null
  minYear: number | null
  maxYear: number | null
  condition: string
  fuelType: string
  country: string
  query: string
  sort: string
  page: number
}

interface SearchResult {
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
  country: string
  images: { url: string; thumbnail: string }[]
  seller: {
    id: number
    name: string
    company?: string
    verified: boolean
  }
  created_at: string
}

interface SearchAggregations {
  categories: { name: string; count: number }[]
  brands: { name: string; count: number }[]
  conditions: { name: string; count: number }[]
  fuel_types: { name: string; count: number }[]
  countries: { name: string; count: number }[]
  price_range: { min: number; max: number }
  year_range: { min: number; max: number }
}

export const useSearch = () => {
  const { $api } = useNuxtApp()

  const filters = ref<SearchFilters>({
    category: '',
    brand: '',
    model: '',
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    condition: '',
    fuelType: '',
    country: '',
    query: '',
    sort: 'newest',
    page: 1,
  })

  const results = ref<SearchResult[]>([])
  const aggregations = ref<SearchAggregations | null>(null)
  const total = ref(0)
  const lastPage = ref(1)
  const isLoading = ref(false)

  const buildQueryString = (): Record<string, unknown> => {
    const params: Record<string, unknown> = {}
    const f = filters.value

    if (f.category) params.category = f.category
    if (f.brand) params.brand = f.brand
    if (f.model) params.model = f.model
    if (f.minPrice !== null) params.min_price = f.minPrice
    if (f.maxPrice !== null) params.max_price = f.maxPrice
    if (f.minYear !== null) params.min_year = f.minYear
    if (f.maxYear !== null) params.max_year = f.maxYear
    if (f.condition) params.condition = f.condition
    if (f.fuelType) params.fuel_type = f.fuelType
    if (f.country) params.country = f.country
    if (f.query) params.q = f.query
    if (f.sort) params.sort = f.sort
    if (f.page > 1) params.page = f.page

    return params
  }

  const search = async () => {
    isLoading.value = true
    try {
      const params = buildQueryString()
      const response = await $api<{
        data: SearchResult[]
        aggregations: SearchAggregations
        meta: { total: number; last_page: number }
      }>('/search', { params })

      results.value = response.data
      aggregations.value = response.aggregations
      total.value = response.meta.total
      lastPage.value = response.meta.last_page
    } catch (err) {
      console.error('Search failed:', err)
      results.value = []
      total.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const updateFilter = (key: keyof SearchFilters, value: unknown) => {
    ;(filters.value as Record<string, unknown>)[key] = value
    filters.value.page = 1
  }

  const clearFilters = () => {
    filters.value = {
      category: '',
      brand: '',
      model: '',
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      condition: '',
      fuelType: '',
      country: '',
      query: '',
      sort: 'newest',
      page: 1,
    }
  }

  let searchTimeout: ReturnType<typeof setTimeout> | null = null
  watch(
    filters,
    () => {
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        search()
      }, 300)
    },
    { deep: true },
  )

  return {
    filters,
    results,
    aggregations,
    total,
    lastPage,
    isLoading,
    search,
    updateFilter,
    clearFilters,
    buildQueryString,
  }
}
