import { Router } from "express";
import { authLimiter } from "@/middleware/rateLimiter";
import { validate } from "@/middleware/validate";
import { contactController } from "@/controllers/contact.controller";
import { contactFormBodySchema } from "@/validators/contact.validator";

// ---------------------------------------------------------------------------
// Contact Routes — /api/contact
// ---------------------------------------------------------------------------

const router = Router();

// POST /api/contact — Submit a contact form (public, rate-limited)
router.post(
  "/",
  authLimiter,
  validate({ body: contactFormBodySchema }),
  contactController.submit
);

export default router;
