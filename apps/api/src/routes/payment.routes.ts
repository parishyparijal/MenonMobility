import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { paymentController } from "@/controllers/payment.controller";

// ---------------------------------------------------------------------------
// Payment Routes — /api/payments
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/payments — List user's payment history
router.get("/", authenticate, paymentController.list);

// GET /api/payments/:id — Get single payment detail
router.get("/:id", authenticate, paymentController.getById);

export default router;
