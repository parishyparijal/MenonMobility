import { z } from "zod";

// ---------------------------------------------------------------------------
// Featured Listing Validator Schemas
// ---------------------------------------------------------------------------

export const purchaseFeaturedBodySchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
  placement: z.enum(["HOMEPAGE", "CATEGORY", "SEARCH", "SIDEBAR"]),
  days: z.number().int().refine((v) => [7, 14, 30].includes(v), {
    message: "Duration must be 7, 14, or 30 days",
  }),
});

export type PurchaseFeaturedBody = z.infer<typeof purchaseFeaturedBodySchema>;
