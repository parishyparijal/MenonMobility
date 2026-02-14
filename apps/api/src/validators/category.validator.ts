import { z } from "zod";

// ---------------------------------------------------------------------------
// Category Query Validators
// ---------------------------------------------------------------------------

/**
 * GET /api/categories
 * Query params for listing categories.
 */
export const listCategoriesQuerySchema = z.object({
  flat: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  active: z
    .enum(["true", "false"])
    .optional()
    .default("true")
    .transform((val) => val === "true"),
  lang: z
    .string()
    .max(5)
    .optional()
    .default("en"),
});

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;

/**
 * GET /api/categories/:slug
 * Params for getting a single category.
 */
export const categorySlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

export type CategorySlugParams = z.infer<typeof categorySlugParamsSchema>;

/**
 * GET /api/categories/:slug/filters
 * Query params for category filter options.
 */
export const categoryFiltersQuerySchema = z.object({
  lang: z
    .string()
    .max(5)
    .optional()
    .default("en"),
});

export type CategoryFiltersQuery = z.infer<typeof categoryFiltersQuerySchema>;
