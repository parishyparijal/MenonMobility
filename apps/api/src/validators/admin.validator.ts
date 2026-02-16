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

// ---- Category Management ----

export const categoryIdParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  slug: z.string().min(1, "Slug is required").max(100).trim(),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  imageUrl: z.string().url().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategoryBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  slug: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// ---- Brand Management ----

export const brandIdParamsSchema = z.object({
  id: z.string().uuid("Invalid brand ID"),
});

export const createBrandBodySchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  slug: z.string().min(1, "Slug is required").max(100).trim(),
  logoUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const updateBrandBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  slug: z.string().min(1).max(100).trim().optional(),
  logoUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const modelIdParamsSchema = z.object({
  id: z.string().uuid("Invalid brand ID"),
  modelId: z.string().uuid("Invalid model ID"),
});

export const createModelBodySchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  slug: z.string().min(1, "Slug is required").max(100).trim(),
  isActive: z.boolean().default(true),
});

export const updateModelBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  slug: z.string().min(1).max(100).trim().optional(),
  isActive: z.boolean().optional(),
});

// ---- Language Management ----

export const languageIdParamsSchema = z.object({
  id: z.string().uuid("Invalid language ID"),
});

export const createLanguageBodySchema = z.object({
  code: z.string().min(2, "Code is required").max(10).trim(),
  name: z.string().min(1, "Name is required").max(100).trim(),
  localName: z.string().min(1, "Local name is required").max(200).trim(),
  countryCode: z.string().min(2).max(5).trim(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateLanguageBodySchema = z.object({
  code: z.string().min(2).max(10).trim().optional(),
  name: z.string().min(1).max(100).trim().optional(),
  localName: z.string().min(1).max(200).trim().optional(),
  countryCode: z.string().min(2).max(5).trim().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});
