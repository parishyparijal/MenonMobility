import { z } from "zod";

// ---------------------------------------------------------------------------
// Search Query Validators
// ---------------------------------------------------------------------------

/**
 * GET /api/search
 * Query params for full-text search across listings.
 */
export const searchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().max(200).optional(),
  brand: z.string().max(200).optional(),
  model: z.string().max(200).optional(),
  condition: z
    .enum(["NEW", "USED", "REFURBISHED"])
    .optional(),
  fuelType: z
    .enum(["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "LPG", "CNG", "HYDROGEN"])
    .optional(),
  transmission: z
    .enum(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"])
    .optional(),
  emissionClass: z
    .enum(["EURO1", "EURO2", "EURO3", "EURO4", "EURO5", "EURO6", "EURO6D"])
    .optional(),
  countryCode: z.string().max(5).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !isNaN(val), "minPrice must be a number"),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !isNaN(val), "maxPrice must be a number"),
  minYear: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !isNaN(val), "minYear must be a number"),
  maxYear: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !isNaN(val), "maxYear must be a number"),
  sort: z
    .enum(["relevance", "price_asc", "price_desc", "date_desc", "date_asc", "year_desc", "year_asc"])
    .optional()
    .default("relevance"),
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

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * GET /api/search/suggestions
 * Query params for autocomplete suggestions.
 */
export const suggestionsQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(200),
});

export type SuggestionsQuery = z.infer<typeof suggestionsQuerySchema>;
