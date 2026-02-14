import { z } from "zod";

// ---------------------------------------------------------------------------
// Favorite Validators
// ---------------------------------------------------------------------------

/**
 * POST /api/favorites
 * Body for toggling a favorite.
 */
export const toggleFavoriteBodySchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
});

export type ToggleFavoriteBody = z.infer<typeof toggleFavoriteBodySchema>;

/**
 * GET /api/favorites
 * Query params for listing favorites.
 */
export const listFavoritesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
});

export type ListFavoritesQuery = z.infer<typeof listFavoritesQuerySchema>;

/**
 * GET /api/favorites/check?listingIds=id1,id2,id3
 * Query params for checking which listings are favorited.
 */
export const checkFavoritesQuerySchema = z.object({
  listingIds: z
    .string()
    .min(1, "At least one listing ID is required")
    .transform((val) => val.split(",").map((id) => id.trim()))
    .refine(
      (ids) => ids.every((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)),
      "All listing IDs must be valid UUIDs"
    ),
});

export type CheckFavoritesQuery = z.infer<typeof checkFavoritesQuerySchema>;
