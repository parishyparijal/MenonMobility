import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  condition: 'NEW' | 'USED';
  category: string;
  subcategory?: string;
  brand: string;
  model: string;
  year: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  power?: string;
  emissionClass?: string;
  color?: string;
  images: string[];
  location: {
    country: string;
    city: string;
    region?: string;
  };
  seller: {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
    rating?: number;
    avatar?: string;
  };
  isFeatured: boolean;
  views: number;
  favorites: number;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'SOLD' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  fuelType?: string;
  transmission?: string;
  country?: string;
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ListingsResponse {
  listings: Listing[];
  pagination: Pagination;
}

interface ListingsState {
  listings: Listing[];
  filters: ListingFilters;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;

  fetchListings: (params?: ListingFilters & { page?: number; limit?: number }) => Promise<void>;
  setFilter: (key: keyof ListingFilters, value: string | number | undefined) => void;
  setFilters: (filters: Partial<ListingFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 24,
  total: 0,
  totalPages: 0,
};

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  filters: {},
  pagination: defaultPagination,
  isLoading: false,
  error: null,

  fetchListings: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const merged = { ...filters, ...params };
      const searchParams = new URLSearchParams();

      Object.entries(merged).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, String(value));
        }
      });

      if (!searchParams.has('page')) {
        searchParams.set('page', String(params?.page ?? pagination.page));
      }
      if (!searchParams.has('limit')) {
        searchParams.set('limit', String(pagination.limit));
      }

      const response = await api.get<ListingsResponse>(`/listings?${searchParams.toString()}`);
      set({
        listings: response.listings,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch listings',
      });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  clearFilters: () => {
    set({
      filters: {},
      pagination: { ...get().pagination, page: 1 },
    });
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
  },
}));
