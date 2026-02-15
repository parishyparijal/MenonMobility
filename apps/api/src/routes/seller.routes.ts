import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { ensureRole } from "@/middleware/roles";
import { uploadLimiter } from "@/middleware/rateLimiter";
import { validate } from "@/middleware/validate";
import { sellerListingController } from "@/controllers/seller-listing.controller";
import { sellerDashboardController } from "@/controllers/seller-dashboard.controller";
import { sellerProfileController } from "@/controllers/seller-profile.controller";
import { listingImageController, imageUpload } from "@/controllers/listing-image.controller";
import {
  sellerListingQuerySchema,
  idParamSchema,
  listingImageParamSchema,
  createListingSchema,
  updateListingSchema,
  imageReorderSchema,
} from "@/validators/listing.validator";

// ---------------------------------------------------------------------------
// Seller Routes — /api/seller
// All routes require authentication + SELLER or ADMIN role
// ---------------------------------------------------------------------------

const router = Router();

// Apply auth + role check to all seller routes
router.use(authenticate, ensureRole("SELLER", "ADMIN"));

// ── Dashboard & Analytics ─────────────────────────────────────────────

// GET /api/seller/dashboard — Seller dashboard stats
router.get("/dashboard", sellerDashboardController.dashboard);

// GET /api/seller/analytics — Seller analytics / insights
router.get("/analytics", sellerDashboardController.analytics);

// ── Profile ───────────────────────────────────────────────────────────

// GET /api/seller/profile — Seller profile
router.get("/profile", sellerProfileController.getMyProfile);

// PUT /api/seller/profile — Update seller profile
router.put("/profile", sellerProfileController.updateMyProfile);

// ── Listing CRUD ──────────────────────────────────────────────────────

// GET /api/seller/listings — Seller's own listings (with status filter)
router.get(
  "/listings",
  validate({ query: sellerListingQuerySchema }),
  sellerListingController.list
);

// POST /api/seller/listings — Create a new listing
router.post(
  "/listings",
  validate({ body: createListingSchema }),
  sellerListingController.create
);

// GET /api/seller/listings/:id — Get a single listing (seller view)
router.get(
  "/listings/:id",
  validate({ params: idParamSchema }),
  sellerListingController.getById
);

// PUT /api/seller/listings/:id — Update a listing
router.put(
  "/listings/:id",
  validate({ params: idParamSchema, body: updateListingSchema }),
  sellerListingController.update
);

// DELETE /api/seller/listings/:id — Soft delete a listing
router.delete(
  "/listings/:id",
  validate({ params: idParamSchema }),
  sellerListingController.remove
);

// ── Listing Lifecycle ─────────────────────────────────────────────────

// POST /api/seller/listings/:id/publish — Submit for review
router.post(
  "/listings/:id/publish",
  validate({ params: idParamSchema }),
  sellerListingController.publish
);

// POST /api/seller/listings/:id/mark-sold — Mark as sold
router.post(
  "/listings/:id/mark-sold",
  validate({ params: idParamSchema }),
  sellerListingController.markSold
);

// POST /api/seller/listings/:id/renew — Extend listing expiry
router.post(
  "/listings/:id/renew",
  validate({ params: idParamSchema }),
  sellerListingController.renew
);

// POST /api/seller/listings/:id/duplicate — Clone listing as draft
router.post(
  "/listings/:id/duplicate",
  validate({ params: idParamSchema }),
  sellerListingController.duplicate
);

// ── Listing Images ────────────────────────────────────────────────────

// POST /api/seller/listings/:id/images — Upload images
router.post(
  "/listings/:id/images",
  validate({ params: idParamSchema }),
  uploadLimiter,
  imageUpload.array("images", 10),
  listingImageController.upload
);

// PUT /api/seller/listings/:id/images/reorder — Reorder images
router.put(
  "/listings/:id/images/reorder",
  validate({ params: idParamSchema, body: imageReorderSchema }),
  listingImageController.reorder
);

// DELETE /api/seller/listings/:id/images/:imageId — Delete an image
router.delete(
  "/listings/:id/images/:imageId",
  validate({ params: listingImageParamSchema }),
  listingImageController.remove
);

export default router;
