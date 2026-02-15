import { Router } from "express";
import { optionalAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { cache } from "@/middleware/cache";
import { listingController } from "@/controllers/listing.controller";
import {
  listingQuerySchema,
  slugParamSchema,
} from "@/validators/listing.validator";

// ---------------------------------------------------------------------------
// Public Listing Routes — /api/listings
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/listings — List all published listings (paginated, filterable)
router.get(
  "/",
  optionalAuth,
  cache(60),
  validate({ query: listingQuerySchema }),
  listingController.list
);

// GET /api/listings/:slug — Get a single listing by slug
router.get(
  "/:slug",
  optionalAuth,
  cache(120),
  validate({ params: slugParamSchema }),
  listingController.getBySlug
);

// GET /api/listings/:slug/related — Get related listings
router.get(
  "/:slug/related",
  optionalAuth,
  cache(120),
  validate({ params: slugParamSchema }),
  listingController.getRelated
);

export default router;
