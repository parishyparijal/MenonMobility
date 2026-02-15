import { Router } from "express";
import { validate } from "@/middleware/validate";
import { cache } from "@/middleware/cache";
import { categoryController } from "@/controllers/category.controller";
import {
  listCategoriesQuerySchema,
  categorySlugParamsSchema,
  categoryFiltersQuerySchema,
} from "@/validators/category.validator";

// ---------------------------------------------------------------------------
// Category Routes — /api/categories
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/categories — List all categories (tree or flat)
router.get(
  "/",
  cache(300),
  validate({ query: listCategoriesQuerySchema }),
  categoryController.list
);

// GET /api/categories/:slug — Get a single category by slug
router.get(
  "/:slug",
  cache(300),
  validate({ params: categorySlugParamsSchema }),
  categoryController.getBySlug
);

// GET /api/categories/:slug/filters — Get available filters for a category
router.get(
  "/:slug/filters",
  cache(120),
  validate({
    params: categorySlugParamsSchema,
    query: categoryFiltersQuerySchema,
  }),
  categoryController.getFilters
);

export default router;
