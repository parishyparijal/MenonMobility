import { Router, type Request, type Response } from "express";

// ---------------------------------------------------------------------------
// CMS Page Routes — /api/pages
// Public pages like "About Us", "Terms", "Privacy Policy", etc.
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/pages — List all published CMS pages
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list CMS pages" });
});

// GET /api/pages/:slug — Get a single CMS page by slug
router.get("/:slug", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: get CMS page "${req.params.slug}"`,
  });
});

export default router;
