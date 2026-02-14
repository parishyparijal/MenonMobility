import { Router } from "express";
import { optionalAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
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
  validate({ query: listingQuerySchema }),
  listingController.list
);

// GET /api/listings/:slug — Get a single listing by slug
router.get(
  "/:slug",
  optionalAuth,
  validate({ params: slugParamSchema }),
  listingController.getBySlug
);

// GET /api/listings/:slug/related — Get related listings
router.get(
  "/:slug/related",
  optionalAuth,
  validate({ params: slugParamSchema }),
  listingController.getRelated
);

export default router;
