import { Router } from "express";
import { validate } from "@/middleware/validate";
import { cache } from "@/middleware/cache";
import { brandController } from "@/controllers/brand.controller";
import {
  listBrandsQuerySchema,
  brandSlugParamsSchema,
} from "@/validators/brand.validator";

// ---------------------------------------------------------------------------
// Brand Routes — /api/brands
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/brands — List all brands (optionally filter by category slug)
router.get(
  "/",
  cache(300),
  validate({ query: listBrandsQuerySchema }),
  brandController.list
);

// GET /api/brands/:slug — Get a single brand by slug with models
router.get(
  "/:slug",
  cache(300),
  validate({ params: brandSlugParamsSchema }),
  brandController.getBySlug
);

export default router;
