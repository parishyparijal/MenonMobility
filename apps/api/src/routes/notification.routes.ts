import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";

// ---------------------------------------------------------------------------
// Notification Routes — /api/notifications
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/notifications — List current user's notifications
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list notifications" });
});

// GET /api/notifications/unread-count — Get unread notification count
router.get("/unread-count", (_req: Request, res: Response) => {
  res.json({ success: true, data: { count: 0 }, message: "TODO: unread notification count" });
});

// PATCH /api/notifications/:id/read — Mark a notification as read
router.patch("/:id/read", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: mark notification "${req.params.id}" as read`,
  });
});

// PATCH /api/notifications/read-all — Mark all notifications as read
router.patch("/read-all", (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: mark all notifications as read" });
});

// DELETE /api/notifications/:id — Delete a notification
router.delete("/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete notification "${req.params.id}"`,
  });
});

export default router;
