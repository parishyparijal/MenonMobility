import { z } from "zod";

// ---------------------------------------------------------------------------
// Message Validators
// ---------------------------------------------------------------------------

/**
 * POST /api/messages
 * Body for sending a message (new thread or existing thread).
 */
export const sendMessageBodySchema = z.object({
  threadId: z.string().uuid("Invalid thread ID").optional(),
  listingId: z.string().uuid("Invalid listing ID").optional(),
  body: z
    .string()
    .min(1, "Message body is required")
    .max(5000, "Message must be at most 5000 characters")
    .trim(),
}).refine(
  (data) => data.threadId || data.listingId,
  { message: "Either threadId or listingId is required", path: ["threadId"] }
);

export type SendMessageBody = z.infer<typeof sendMessageBodySchema>;

/**
 * GET /api/messages/:threadId
 * Params for getting messages in a thread.
 */
export const threadParamsSchema = z.object({
  threadId: z.string().uuid("Invalid thread ID"),
});

export type ThreadParams = z.infer<typeof threadParamsSchema>;

/**
 * GET /api/messages
 * Query params for listing message threads.
 */
export const listThreadsQuerySchema = z.object({
  archived: z
    .enum(["true", "false"])
    .optional()
    .default("false")
    .transform((val) => val === "true"),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
});

export type ListThreadsQuery = z.infer<typeof listThreadsQuerySchema>;

/**
 * GET /api/messages/:threadId/messages
 * Query params for getting messages in a thread (pagination).
 */
export const threadMessagesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default("50")
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 50))),
});

export type ThreadMessagesQuery = z.infer<typeof threadMessagesQuerySchema>;
