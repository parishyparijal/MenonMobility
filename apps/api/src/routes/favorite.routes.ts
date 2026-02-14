import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";

// ---------------------------------------------------------------------------
// Favorite Routes — /api/favorites
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/favorites — Get current user's favorite listings
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list user favorites" });
});

// POST /api/favorites — Add a listing to favorites
router.post("/", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "TODO: add to favorites" });
});

// DELETE /api/favorites/:listingId — Remove a listing from favorites
router.delete("/:listingId", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: remove listing "${req.params.listingId}" from favorites`,
  });
});

export default router;
