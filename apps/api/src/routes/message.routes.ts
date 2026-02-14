import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { messageController } from "@/controllers/message.controller";
import {
  sendMessageBodySchema,
  threadParamsSchema,
  listThreadsQuerySchema,
  threadMessagesQuerySchema,
} from "@/validators/message.validator";

// ---------------------------------------------------------------------------
// Message Routes — /api/messages
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/messages/unread — Get total unread message count (must be before /:threadId)
router.get("/unread", messageController.getUnreadCount);

// GET /api/messages — List all message threads for the current user
router.get(
  "/",
  validate({ query: listThreadsQuerySchema }),
  messageController.listThreads
);

// GET /api/messages/:threadId — Get messages in a specific thread
router.get(
  "/:threadId",
  validate({ params: threadParamsSchema, query: threadMessagesQuerySchema }),
  messageController.getThread
);

// POST /api/messages — Send a message (new thread or existing thread)
router.post(
  "/",
  validate({ body: sendMessageBodySchema }),
  messageController.sendMessage
);

// PATCH /api/messages/:threadId/archive — Archive a thread
router.patch(
  "/:threadId/archive",
  validate({ params: threadParamsSchema }),
  messageController.archiveThread
);

export default router;
