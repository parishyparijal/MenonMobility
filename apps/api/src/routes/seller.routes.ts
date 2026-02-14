import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";
import { ensureRole } from "@/middleware/roles";
import { uploadLimiter } from "@/middleware/rateLimiter";

// ---------------------------------------------------------------------------
// Seller Routes — /api/seller
// All routes require authentication + SELLER or ADMIN role
// ---------------------------------------------------------------------------

const router = Router();

// Apply auth + role check to all seller routes
router.use(authenticate, ensureRole("SELLER", "ADMIN"));

// GET /api/seller/dashboard — Seller dashboard stats
router.get("/dashboard", (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: seller dashboard" });
});

// GET /api/seller/listings — Seller's own listings
router.get("/listings", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: seller listings" });
});

// POST /api/seller/listings — Create a new listing
router.post("/listings", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, data: null, message: "TODO: create listing" });
});

// GET /api/seller/listings/:id — Get a single listing (seller view)
router.get("/listings/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: get seller listing "${req.params.id}"`,
  });
});

// PUT /api/seller/listings/:id — Update a listing
router.put("/listings/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: update seller listing "${req.params.id}"`,
  });
});

// DELETE /api/seller/listings/:id — Delete a listing
router.delete("/listings/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete seller listing "${req.params.id}"`,
  });
});

// POST /api/seller/listings/:id/images — Upload images for a listing
router.post("/listings/:id/images", uploadLimiter, (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    data: [],
    message: `TODO: upload images for listing "${req.params.id}"`,
  });
});

// DELETE /api/seller/listings/:id/images/:imageId — Remove a listing image
router.delete("/listings/:id/images/:imageId", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete image "${req.params.imageId}" from listing "${req.params.id}"`,
  });
});

// GET /api/seller/analytics — Seller analytics / insights
router.get("/analytics", (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: seller analytics" });
});

// GET /api/seller/profile — Seller profile
router.get("/profile", (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: get seller profile" });
});

// PUT /api/seller/profile — Update seller profile
router.put("/profile", (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: update seller profile" });
});

export default router;
