import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";

// ---------------------------------------------------------------------------
// Message Routes — /api/messages
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/messages — List all message threads for the current user
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list message threads" });
});

// GET /api/messages/:threadId — Get messages in a specific thread
router.get("/:threadId", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: `TODO: get messages for thread "${req.params.threadId}"`,
  });
});

// POST /api/messages — Start a new message thread (e.g., contact seller about listing)
router.post("/", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, data: null, message: "TODO: create message thread" });
});

// POST /api/messages/:threadId — Send a message in an existing thread
router.post("/:threadId", (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    data: null,
    message: `TODO: send message in thread "${req.params.threadId}"`,
  });
});

// PATCH /api/messages/:threadId/read — Mark thread as read
router.patch("/:threadId/read", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: mark thread "${req.params.threadId}" as read`,
  });
});

export default router;
