import { Router } from "express";
import { validate } from "@/middleware/validate";
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
  validate({ query: listBrandsQuerySchema }),
  brandController.list
);

// GET /api/brands/:slug — Get a single brand by slug with models
router.get(
  "/:slug",
  validate({ params: brandSlugParamsSchema }),
  brandController.getBySlug
);

export default router;
