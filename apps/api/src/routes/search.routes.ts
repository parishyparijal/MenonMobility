import { Router, type Request, type Response } from "express";

// ---------------------------------------------------------------------------
// Search Routes — /api/search
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/search — Full-text search for listings via Elasticsearch
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: search listings" });
});

// GET /api/search/suggestions — Autocomplete / typeahead suggestions
router.get("/suggestions", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: search suggestions" });
});

export default router;
