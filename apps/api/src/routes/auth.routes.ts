import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { authLimiter } from "@/middleware/rateLimiter";
import { validate } from "@/middleware/validate";
import { authController } from "@/controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  updateProfileSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "@/validators/auth.validator";

// ---------------------------------------------------------------------------
// Auth Routes — /api/auth
// ---------------------------------------------------------------------------

const router = Router();

// Apply stricter rate limiting to all auth routes
router.use(authLimiter);

// POST /api/auth/register
router.post(
  "/register",
  validate({ body: registerSchema.shape.body }),
  authController.register
);

// POST /api/auth/login
router.post(
  "/login",
  validate({ body: loginSchema.shape.body }),
  authController.login
);

// POST /api/auth/logout
router.post("/logout", authenticate, authController.logout);

// POST /api/auth/refresh
router.post(
  "/refresh",
  validate({ body: refreshTokenSchema.shape.body }),
  authController.refresh
);

// GET /api/auth/me
router.get("/me", authenticate, authController.me);

// PUT /api/auth/me (update profile)
router.put(
  "/me",
  authenticate,
  validate({ body: updateProfileSchema.shape.body }),
  authController.updateProfile
);

// POST /api/auth/verify-email
router.post(
  "/verify-email",
  validate({ body: verifyEmailSchema.shape.body }),
  authController.verifyEmail
);

// POST /api/auth/resend-verification
router.post(
  "/resend-verification",
  validate({ body: resendVerificationSchema.shape.body }),
  authController.resendVerificationCode
);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema.shape.body }),
  authController.forgotPassword
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  validate({ body: resetPasswordSchema.shape.body }),
  authController.resetPassword
);

// POST /api/auth/change-password
router.post(
  "/change-password",
  authenticate,
  validate({ body: changePasswordSchema.shape.body }),
  authController.changePassword
);

export default router;
