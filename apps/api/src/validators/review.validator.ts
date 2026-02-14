import { z } from "zod";

// ---------------------------------------------------------------------------
// Review Validators
// ---------------------------------------------------------------------------

/**
 * POST /api/sellers/:slug/reviews
 * Body for creating a review.
 */
export const createReviewBodySchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  title: z
    .string()
    .max(200, "Title must be at most 200 characters")
    .trim()
    .optional(),
  body: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review must be at most 2000 characters")
    .trim(),
  listingId: z.string().uuid("Invalid listing ID").optional(),
});

export type CreateReviewBody = z.infer<typeof createReviewBodySchema>;

/**
 * POST /api/sellers/:slug/reviews/:reviewId/respond
 * Body for responding to a review.
 */
export const respondToReviewBodySchema = z.object({
  response: z
    .string()
    .min(1, "Response is required")
    .max(2000, "Response must be at most 2000 characters")
    .trim(),
});

export type RespondToReviewBody = z.infer<typeof respondToReviewBodySchema>;

/**
 * Params for seller slug.
 */
export const sellerSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200),
});

export type SellerSlugParams = z.infer<typeof sellerSlugParamsSchema>;

/**
 * Params for review ID.
 */
export const reviewIdParamsSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200),
  reviewId: z.string().uuid("Invalid review ID"),
});

export type ReviewIdParams = z.infer<typeof reviewIdParamsSchema>;

/**
 * Query params for listing reviews (paginated).
 */
export const listReviewsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => Math.min(50, Math.max(1, parseInt(val, 10) || 10))),
});

export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;

/**
 * Query params for seller profile listings (paginated).
 */
export const sellerListingsQuerySchema = z.object({
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

export type SellerListingsQuery = z.infer<typeof sellerListingsQuerySchema>;
