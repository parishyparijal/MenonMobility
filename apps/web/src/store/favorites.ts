import { create } from 'zustand';
import { api } from '@/lib/api';

interface FavoriteListing {
  id: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    price: number | null;
    priceCurrency: string;
    priceOnRequest: boolean;
    condition: string;
    year: number;
    status: string;
    countryCode: string;
    city: string;
    images: { id: string; thumbnailUrl: string; mediumUrl: string; originalUrl: string; altText: string }[];
  };
}

interface FavoritesState {
  favoriteIds: Set<string>;
  favorites: FavoriteListing[];
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };

  fetchFavorites: (page?: number) => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<boolean>;
  checkFavorites: (listingIds: string[]) => Promise<void>;
  isFavorited: (listingId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set<string>(),
  favorites: [],
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },

  fetchFavorites: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<any>(`/favorites?page=${page}&limit=20`);
      if (response?.success && response?.data) {
        const favs = response.data as FavoriteListing[];
        const ids = new Set(favs.map((f: FavoriteListing) => f.listing.id));
        set({
          favorites: favs,
          favoriteIds: ids,
          pagination: response.pagination || get().pagination,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorites',
      });
    }
  },

  toggleFavorite: async (listingId: string) => {
    const { favoriteIds } = get();
    const wasFav = favoriteIds.has(listingId);

    // Optimistic update
    const newSet = new Set(favoriteIds);
    if (wasFav) {
      newSet.delete(listingId);
    } else {
      newSet.add(listingId);
    }
    set({ favoriteIds: newSet });

    try {
      // Backend uses POST /favorites with { listingId } to toggle
      const response = await api.post<any>('/favorites', { listingId });
      return response?.data?.isFavorited ?? !wasFav;
    } catch (error) {
      // Revert on failure
      const revertSet = new Set(get().favoriteIds);
      if (wasFav) {
        revertSet.add(listingId);
      } else {
        revertSet.delete(listingId);
      }
      set({
        favoriteIds: revertSet,
        error: error instanceof Error ? error.message : 'Failed to update favorite',
      });
      return wasFav;
    }
  },

  checkFavorites: async (listingIds: string[]) => {
    if (listingIds.length === 0) return;
    try {
      const response = await api.get<any>(`/favorites/check?listingIds=${listingIds.join(',')}`);
      if (response?.success && response?.data) {
        const { favoriteIds } = get();
        const newSet = new Set(favoriteIds);
        for (const [id, isFav] of Object.entries(response.data)) {
          if (isFav) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
        }
        set({ favoriteIds: newSet });
      }
    } catch {
      // Silently fail — non-critical
    }
  },

  isFavorited: (listingId: string) => {
    return get().favoriteIds.has(listingId);
  },
}));
