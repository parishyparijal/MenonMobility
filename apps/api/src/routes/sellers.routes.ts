import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { sellerProfileController } from "@/controllers/seller-profile.controller";
import { reviewController } from "@/controllers/review.controller";
import {
  createReviewBodySchema,
  respondToReviewBodySchema,
  sellerSlugParamsSchema,
  reviewIdParamsSchema,
  listReviewsQuerySchema,
  sellerListingsQuerySchema,
} from "@/validators/review.validator";

// ---------------------------------------------------------------------------
// Public Seller Profile Routes — /api/sellers
// Mix of public and authenticated routes
// ---------------------------------------------------------------------------

const router = Router();

// ---- Authenticated: Own profile management ----

// GET /api/sellers/me — Get own seller profile (must be before /:slug)
router.get("/me", authenticate, sellerProfileController.getMyProfile);

// PUT /api/sellers/me — Update own seller profile
router.put("/me", authenticate, sellerProfileController.updateMyProfile);

// ---- Public: Seller profile and listings ----

// GET /api/sellers/:slug — Get seller profile by slug
router.get(
  "/:slug",
  validate({ params: sellerSlugParamsSchema }),
  sellerProfileController.getProfile
);

// GET /api/sellers/:slug/listings — Get seller's active listings
router.get(
  "/:slug/listings",
  validate({ params: sellerSlugParamsSchema, query: sellerListingsQuerySchema }),
  sellerProfileController.getProfileListings
);

// GET /api/sellers/:slug/reviews — Get reviews for a seller
router.get(
  "/:slug/reviews",
  validate({ params: sellerSlugParamsSchema, query: listReviewsQuerySchema }),
  sellerProfileController.getReviews
);

// POST /api/sellers/:slug/reviews — Create a review for a seller (authenticated)
router.post(
  "/:slug/reviews",
  authenticate,
  validate({ params: sellerSlugParamsSchema, body: createReviewBodySchema }),
  reviewController.create
);

// POST /api/sellers/:slug/reviews/:reviewId/respond — Seller responds to a review (authenticated)
router.post(
  "/:slug/reviews/:reviewId/respond",
  authenticate,
  validate({ params: reviewIdParamsSchema, body: respondToReviewBodySchema }),
  reviewController.respond
);

export default router;
