import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { notificationController } from "@/controllers/notification.controller";

// ---------------------------------------------------------------------------
// Notification Routes — /api/notifications
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/notifications — List current user's notifications
router.get("/", notificationController.list);

// GET /api/notifications/unread-count — Get unread notification count
router.get("/unread-count", notificationController.getUnreadCount);

// PATCH /api/notifications/read-all — Mark all notifications as read (must be before /:id)
router.patch("/read-all", notificationController.markAllRead);

// PATCH /api/notifications/:id/read — Mark a notification as read
router.patch("/:id/read", notificationController.markRead);

export default router;
