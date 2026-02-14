import { z } from "zod";

// ---------------------------------------------------------------------------
// Brand Query Validators
// ---------------------------------------------------------------------------

/**
 * GET /api/brands
 * Query params for listing brands.
 */
export const listBrandsQuerySchema = z.object({
  category: z
    .string()
    .max(200)
    .optional(),
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

export type ListBrandsQuery = z.infer<typeof listBrandsQuerySchema>;

/**
 * GET /api/brands/:slug
 * Params for getting a single brand by slug.
 */
export const brandSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

export type BrandSlugParams = z.infer<typeof brandSlugParamsSchema>;
