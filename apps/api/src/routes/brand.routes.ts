import { Router, type Request, type Response } from "express";

// ---------------------------------------------------------------------------
// Brand Routes — /api/brands
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/brands — List all brands
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list brands" });
});

// GET /api/brands/:id/models — Get models for a specific brand
router.get("/:id/models", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: `TODO: get models for brand "${req.params.id}"`,
  });
});

export default router;
