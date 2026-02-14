import { z } from "zod";

// ---------------------------------------------------------------------------
// Admin Validator Schemas
// ---------------------------------------------------------------------------

/**
 * GET /api/admin/users
 * Query params for listing users with search, role filter, and active filter.
 */
export const listUsersQuerySchema = z.object({
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
  search: z.string().max(200).optional(),
  role: z.enum(["BUYER", "SELLER", "ADMIN"]).optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true")),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

/**
 * GET /api/admin/users/:id
 * Params for getting a single user.
 */
export const userIdParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export type UserIdParams = z.infer<typeof userIdParamsSchema>;

/**
 * PUT /api/admin/users/:id
 * Body for updating a user (role, isActive).
 */
export const updateUserBodySchema = z.object({
  role: z.enum(["BUYER", "SELLER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

/**
 * GET /api/admin/listings
 * Query params for listing all listings with status filter.
 */
export const listListingsQuerySchema = z.object({
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
  status: z
    .enum([
      "DRAFT",
      "PENDING_REVIEW",
      "ACTIVE",
      "SOLD",
      "EXPIRED",
      "REJECTED",
      "ARCHIVED",
    ])
    .optional(),
});

export type ListListingsQuery = z.infer<typeof listListingsQuerySchema>;

/**
 * GET/DELETE /api/admin/listings/:id
 * Params for listing operations.
 */
export const listingIdParamsSchema = z.object({
  id: z.string().uuid("Invalid listing ID"),
});

export type ListingIdParams = z.infer<typeof listingIdParamsSchema>;

/**
 * PATCH /api/admin/listings/:id/reject
 * Body for rejecting a listing — requires a reason.
 */
export const rejectListingBodySchema = z.object({
  rejectedReason: z
    .string()
    .min(5, "Rejection reason must be at least 5 characters")
    .max(1000, "Rejection reason must be at most 1000 characters")
    .trim(),
});

export type RejectListingBody = z.infer<typeof rejectListingBodySchema>;

/**
 * GET /api/admin/reviews
 * Query params for listing reviews.
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
    .default("20")
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
  flagged: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true")),
});

export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;

/**
 * DELETE /api/admin/reviews/:id
 * Params for deleting a review.
 */
export const reviewIdParamsSchema = z.object({
  id: z.string().uuid("Invalid review ID"),
});

export type ReviewIdParams = z.infer<typeof reviewIdParamsSchema>;
