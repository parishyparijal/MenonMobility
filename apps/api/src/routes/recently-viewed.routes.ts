import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { recentlyViewedController } from "@/controllers/recently-viewed.controller";
import { listRecentlyViewedQuerySchema } from "@/validators/recently-viewed.validator";

// ---------------------------------------------------------------------------
// Recently Viewed Routes — /api/recently-viewed
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/recently-viewed
router.get(
  "/",
  validate({ query: listRecentlyViewedQuerySchema }),
  recentlyViewedController.list
);

export default router;
