import { Router } from "express";
import { validate } from "@/middleware/validate";
import { pageController } from "@/controllers/page.controller";
import { pageSlugParamsSchema } from "@/validators/page.validator";

// ---------------------------------------------------------------------------
// CMS Page Routes — /api/pages
// Public pages like "About Us", "Terms", "Privacy Policy", etc.
// Admin page routes are under /api/admin/pages (see admin.routes.ts)
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/pages — List all published CMS pages
router.get("/", pageController.list);

// GET /api/pages/:slug — Get a single CMS page by slug
router.get(
  "/:slug",
  validate({ params: pageSlugParamsSchema }),
  pageController.getBySlug
);

export default router;
