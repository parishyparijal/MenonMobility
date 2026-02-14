import { z } from "zod";

// ---------------------------------------------------------------------------
// CMS Page Validator Schemas
// ---------------------------------------------------------------------------

/**
 * GET /api/pages/:slug
 * Params for getting a page by slug.
 */
export const pageSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

export type PageSlugParams = z.infer<typeof pageSlugParamsSchema>;

/**
 * POST /api/admin/pages
 * Body for creating a CMS page.
 */
export const createPageBodySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .trim(),
  title: z.record(z.string(), z.string()).refine(
    (val) => val.en !== undefined && val.en.length > 0,
    { message: "English title (en) is required" }
  ),
  body: z.record(z.string(), z.string()).refine(
    (val) => val.en !== undefined && val.en.length > 0,
    { message: "English body (en) is required" }
  ),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreatePageBody = z.infer<typeof createPageBodySchema>;

/**
 * PUT /api/admin/pages/:id
 * Body for updating a CMS page.
 */
export const updatePageBodySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .trim()
    .optional(),
  title: z
    .record(z.string(), z.string())
    .optional(),
  body: z
    .record(z.string(), z.string())
    .optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type UpdatePageBody = z.infer<typeof updatePageBodySchema>;

/**
 * DELETE/GET /api/admin/pages/:id
 * Params for page operations by ID.
 */
export const pageIdParamsSchema = z.object({
  id: z.string().uuid("Invalid page ID"),
});

export type PageIdParams = z.infer<typeof pageIdParamsSchema>;
