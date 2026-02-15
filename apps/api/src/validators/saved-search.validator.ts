import { z } from "zod";

export const createSavedSearchBodySchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  filters: z.record(z.any()),
  emailFrequency: z.enum(["NEVER", "DAILY", "WEEKLY"]).default("NEVER"),
});

export const updateSavedSearchBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  emailFrequency: z.enum(["NEVER", "DAILY", "WEEKLY"]).optional(),
});

export const savedSearchIdParamsSchema = z.object({
  id: z.string().uuid("Invalid saved search ID"),
});

export const listSavedSearchesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
