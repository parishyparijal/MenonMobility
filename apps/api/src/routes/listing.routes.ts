import { Router, type Request, type Response } from "express";
import { optionalAuth } from "@/middleware/auth";

// ---------------------------------------------------------------------------
// Public Listing Routes — /api/listings
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/listings — List all published listings (paginated, filterable)
router.get("/", optionalAuth, (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list published listings" });
});

// GET /api/listings/:slug — Get a single listing by slug
router.get("/:slug", optionalAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: get listing by slug "${req.params.slug}"`,
  });
});

// GET /api/listings/:slug/related — Get related listings
router.get("/:slug/related", optionalAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: `TODO: get related listings for slug "${req.params.slug}"`,
  });
});

export default router;
