import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { ensureRole } from "@/middleware/roles";
import { validate } from "@/middleware/validate";
import { adminController } from "@/controllers/admin.controller";
import { pageController } from "@/controllers/page.controller";
import { categoryController } from "@/controllers/category.controller";
import { brandController } from "@/controllers/brand.controller";
import {
  listUsersQuerySchema,
  userIdParamsSchema,
  updateUserBodySchema,
  listListingsQuerySchema,
  listingIdParamsSchema,
  rejectListingBodySchema,
  listReviewsQuerySchema,
  reviewIdParamsSchema,
  categoryIdParamsSchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
  brandIdParamsSchema,
  createBrandBodySchema,
  updateBrandBodySchema,
  modelIdParamsSchema,
  createModelBodySchema,
  updateModelBodySchema,
} from "@/validators/admin.validator";
import {
  createPageBodySchema,
  updatePageBodySchema,
  pageIdParamsSchema,
} from "@/validators/page.validator";

// ---------------------------------------------------------------------------
// Admin Routes — /api/admin
// All routes require authentication + ADMIN role
// ---------------------------------------------------------------------------

const router = Router();

// Apply auth + admin role check to all admin routes
router.use(authenticate, ensureRole("ADMIN"));

// ---- Dashboard ----
router.get("/dashboard", adminController.dashboard);

// ---- User Management ----
router.get(
  "/users",
  validate({ query: listUsersQuerySchema }),
  adminController.listUsers
);

router.get(
  "/users/:id",
  validate({ params: userIdParamsSchema }),
  adminController.getUser
);

router.put(
  "/users/:id",
  validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
  adminController.updateUser
);

router.patch(
  "/users/:id/ban",
  validate({ params: userIdParamsSchema }),
  adminController.banUser
);

// ---- Listing Management ----
router.get(
  "/listings",
  validate({ query: listListingsQuerySchema }),
  adminController.listListings
);

router.patch(
  "/listings/:id/approve",
  validate({ params: listingIdParamsSchema }),
  adminController.approveListing
);

router.patch(
  "/listings/:id/reject",
  validate({ params: listingIdParamsSchema, body: rejectListingBodySchema }),
  adminController.rejectListing
);

router.delete(
  "/listings/:id",
  validate({ params: listingIdParamsSchema }),
  adminController.deleteListing
);

// ---- Review Management ----
router.get(
  "/reviews",
  validate({ query: listReviewsQuerySchema }),
  adminController.listReviews
);

router.delete(
  "/reviews/:id",
  validate({ params: reviewIdParamsSchema }),
  adminController.deleteReview
);

// ---- Page / CMS Management ----
router.get("/pages", pageController.adminList);

router.post(
  "/pages",
  validate({ body: createPageBodySchema }),
  pageController.create
);

router.put(
  "/pages/:id",
  validate({ params: pageIdParamsSchema, body: updatePageBodySchema }),
  pageController.update
);

router.delete(
  "/pages/:id",
  validate({ params: pageIdParamsSchema }),
  pageController.remove
);

// ---- Category Management ----
router.post(
  "/categories",
  validate({ body: createCategoryBodySchema }),
  categoryController.create
);

router.put(
  "/categories/:id",
  validate({ params: categoryIdParamsSchema, body: updateCategoryBodySchema }),
  categoryController.update
);

router.delete(
  "/categories/:id",
  validate({ params: categoryIdParamsSchema }),
  categoryController.remove
);

// ---- Brand Management ----
router.post(
  "/brands",
  validate({ body: createBrandBodySchema }),
  brandController.create
);

router.put(
  "/brands/:id",
  validate({ params: brandIdParamsSchema, body: updateBrandBodySchema }),
  brandController.update
);

router.delete(
  "/brands/:id",
  validate({ params: brandIdParamsSchema }),
  brandController.remove
);

// ---- Brand Model Management ----
router.post(
  "/brands/:id/models",
  validate({ params: brandIdParamsSchema, body: createModelBodySchema }),
  brandController.createModel
);

router.put(
  "/brands/:id/models/:modelId",
  validate({ params: modelIdParamsSchema, body: updateModelBodySchema }),
  brandController.updateModel
);

router.delete(
  "/brands/:id/models/:modelId",
  validate({ params: modelIdParamsSchema }),
  brandController.deleteModel
);

export default router;
