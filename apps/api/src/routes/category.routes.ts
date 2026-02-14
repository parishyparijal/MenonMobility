import { Router, type Request, type Response } from "express";

// ---------------------------------------------------------------------------
// Category Routes — /api/categories
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/categories — List all categories (with optional nesting)
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list categories" });
});

// GET /api/categories/:slug — Get a single category by slug
router.get("/:slug", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: get category by slug "${req.params.slug}"`,
  });
});

export default router;
