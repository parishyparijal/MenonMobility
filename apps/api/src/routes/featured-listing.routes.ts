import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { featuredListingController } from "@/controllers/featured-listing.controller";
import { purchaseFeaturedBodySchema } from "@/validators/featured-listing.validator";

// ---------------------------------------------------------------------------
// Featured Listing Routes — /api/featured-listings
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/featured-listings/pricing — Get pricing options (public)
router.get("/pricing", featuredListingController.getPricing);

// GET /api/featured-listings/active — Get currently featured listings (public)
router.get("/active", featuredListingController.listActive);

// GET /api/featured-listings/my — List user's featured listings
router.get("/my", authenticate, featuredListingController.listMine);

// POST /api/featured-listings/purchase — Create checkout for featuring
router.post(
  "/purchase",
  authenticate,
  validate({ body: purchaseFeaturedBodySchema }),
  featuredListingController.purchase
);

export default router;
