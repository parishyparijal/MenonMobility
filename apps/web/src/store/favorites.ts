import { create } from 'zustand';
import { api } from '@/lib/api';

interface FavoritesState {
  favoriteIds: Set<string>;
  isLoading: boolean;
  error: string | null;

  fetchFavorites: () => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
  isFavorited: (listingId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set<string>(),
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ favoriteIds: string[] }>('/favorites');
      set({
        favoriteIds: new Set(response.favoriteIds),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorites',
      });
    }
  },

  toggleFavorite: async (listingId: string) => {
    const { favoriteIds } = get();
    const isFav = favoriteIds.has(listingId);

    // Optimistic update
    const newSet = new Set(favoriteIds);
    if (isFav) {
      newSet.delete(listingId);
    } else {
      newSet.add(listingId);
    }
    set({ favoriteIds: newSet });

    try {
      if (isFav) {
        await api.del(`/favorites/${listingId}`);
      } else {
        await api.post(`/favorites/${listingId}`);
      }
    } catch (error) {
      // Revert on failure
      const revertSet = new Set(get().favoriteIds);
      if (isFav) {
        revertSet.add(listingId);
      } else {
        revertSet.delete(listingId);
      }
      set({
        favoriteIds: revertSet,
        error: error instanceof Error ? error.message : 'Failed to update favorite',
      });
    }
  },

  isFavorited: (listingId: string) => {
    return get().favoriteIds.has(listingId);
  },
}));
