import { Router } from "express";
import { validate } from "@/middleware/validate";
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
  validate({ query: listCategoriesQuerySchema }),
  categoryController.list
);

// GET /api/categories/:slug — Get a single category by slug
router.get(
  "/:slug",
  validate({ params: categorySlugParamsSchema }),
  categoryController.getBySlug
);

// GET /api/categories/:slug/filters — Get available filters for a category
router.get(
  "/:slug/filters",
  validate({
    params: categorySlugParamsSchema,
    query: categoryFiltersQuerySchema,
  }),
  categoryController.getFilters
);

export default router;
