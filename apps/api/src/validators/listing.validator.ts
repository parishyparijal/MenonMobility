import { z } from "zod";

// ---------------------------------------------------------------------------
// Listing Validators — Zod schemas for all listing-related endpoints
// ---------------------------------------------------------------------------

// Helper: coerce string query params to number
const coerceOptionalInt = z
  .string()
  .optional()
  .transform((val) => (val ? parseInt(val, 10) : undefined))
  .pipe(z.number().int().positive().optional());

const coerceOptionalFloat = z
  .string()
  .optional()
  .transform((val) => (val ? parseFloat(val) : undefined))
  .pipe(z.number().positive().optional());

// ── Query schema for GET /api/listings ────────────────────────────────

export const listingQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100)),
  category: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]).optional(),
  fuelType: z
    .enum(["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "LPG", "CNG", "HYDROGEN"])
    .optional(),
  transmission: z.enum(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"]).optional(),
  emissionClass: z
    .enum(["EURO1", "EURO2", "EURO3", "EURO4", "EURO5", "EURO6", "EURO6D"])
    .optional(),
  countryCode: z.string().max(3).optional(),
  minPrice: coerceOptionalFloat,
  maxPrice: coerceOptionalFloat,
  minYear: coerceOptionalInt,
  maxYear: coerceOptionalInt,
  minMileage: coerceOptionalInt,
  maxMileage: coerceOptionalInt,
  sort: z
    .enum(["newest", "oldest", "price_asc", "price_desc", "year_desc", "mileage_asc"])
    .optional()
    .default("newest"),
});

// ── Seller listing query schema (includes status filter) ──────────────

export const sellerListingQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100)),
  status: z
    .enum(["all", "DRAFT", "PENDING_REVIEW", "ACTIVE", "SOLD", "EXPIRED", "REJECTED", "ARCHIVED"])
    .optional()
    .default("all"),
  sort: z
    .enum(["newest", "oldest", "price_asc", "price_desc", "year_desc", "mileage_asc"])
    .optional()
    .default("newest"),
});

// ── Slug param schema ─────────────────────────────────────────────────

export const slugParamSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(300, "Slug is too long"),
});

// ── ID param schema ───────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid listing ID"),
});

// ── Image ID param schema ─────────────────────────────────────────────

export const listingImageParamSchema = z.object({
  id: z.string().uuid("Invalid listing ID"),
  imageId: z.string().uuid("Invalid image ID"),
});

// ── Create listing body schema ────────────────────────────────────────

export const createListingSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID").optional().nullable(),
  modelId: z.string().uuid("Invalid model ID").optional().nullable(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .max(10000, "Description must be at most 10,000 characters")
    .optional()
    .nullable(),
  price: z.number().min(0, "Price cannot be negative").optional().nullable(),
  priceCurrency: z.string().length(3, "Currency must be a 3-letter code").default("EUR"),
  priceOnRequest: z.boolean().default(false),
  priceNegotiable: z.boolean().default(false),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]).default("USED"),
  year: z
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future")
    .optional()
    .nullable(),
  mileageKm: z.number().int().min(0).optional().nullable(),
  operatingHours: z.number().int().min(0).optional().nullable(),
  fuelType: z
    .enum(["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "LPG", "CNG", "HYDROGEN"])
    .optional()
    .nullable(),
  transmission: z.enum(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"]).optional().nullable(),
  powerHp: z.number().int().min(0).optional().nullable(),
  powerKw: z.number().int().min(0).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  vin: z.string().max(30).optional().nullable(),
  gvwKg: z.number().int().min(0).optional().nullable(),
  payloadKg: z.number().int().min(0).optional().nullable(),
  axleCount: z.number().int().min(1).max(20).optional().nullable(),
  cabType: z.string().max(50).optional().nullable(),
  emissionClass: z
    .enum(["EURO1", "EURO2", "EURO3", "EURO4", "EURO5", "EURO6", "EURO6D"])
    .optional()
    .nullable(),
  wheelbaseMm: z.number().int().min(0).optional().nullable(),
  suspensionType: z.string().max(50).optional().nullable(),
  bodyType: z.string().max(100).optional().nullable(),
  driveConfiguration: z.string().max(20).optional().nullable(),
  numberOfDoors: z.number().int().min(2).max(7).optional().nullable(),
  numberOfSeats: z.number().int().min(1).max(60).optional().nullable(),
  containerSize: z.enum(["FT20", "FT40", "FT45"]).optional().nullable(),
  containerType: z.string().max(50).optional().nullable(),
  countryCode: z.string().max(3).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  contactPhone: z.string().max(30).optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactWhatsapp: z.string().max(30).optional().nullable(),
  hidePhone: z.boolean().default(false),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
});

// ── Update listing body schema (all optional) ─────────────────────────

export const updateListingSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
  brandId: z.string().uuid("Invalid brand ID").optional().nullable(),
  modelId: z.string().uuid("Invalid model ID").optional().nullable(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(10000, "Description must be at most 10,000 characters")
    .optional()
    .nullable(),
  price: z.number().min(0, "Price cannot be negative").optional().nullable(),
  priceCurrency: z.string().length(3, "Currency must be a 3-letter code").optional(),
  priceOnRequest: z.boolean().optional(),
  priceNegotiable: z.boolean().optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]).optional(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional()
    .nullable(),
  mileageKm: z.number().int().min(0).optional().nullable(),
  operatingHours: z.number().int().min(0).optional().nullable(),
  fuelType: z
    .enum(["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "LPG", "CNG", "HYDROGEN"])
    .optional()
    .nullable(),
  transmission: z.enum(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"]).optional().nullable(),
  powerHp: z.number().int().min(0).optional().nullable(),
  powerKw: z.number().int().min(0).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  vin: z.string().max(30).optional().nullable(),
  gvwKg: z.number().int().min(0).optional().nullable(),
  payloadKg: z.number().int().min(0).optional().nullable(),
  axleCount: z.number().int().min(1).max(20).optional().nullable(),
  cabType: z.string().max(50).optional().nullable(),
  emissionClass: z
    .enum(["EURO1", "EURO2", "EURO3", "EURO4", "EURO5", "EURO6", "EURO6D"])
    .optional()
    .nullable(),
  wheelbaseMm: z.number().int().min(0).optional().nullable(),
  suspensionType: z.string().max(50).optional().nullable(),
  bodyType: z.string().max(100).optional().nullable(),
  driveConfiguration: z.string().max(20).optional().nullable(),
  numberOfDoors: z.number().int().min(2).max(7).optional().nullable(),
  numberOfSeats: z.number().int().min(1).max(60).optional().nullable(),
  containerSize: z.enum(["FT20", "FT40", "FT45"]).optional().nullable(),
  containerType: z.string().max(50).optional().nullable(),
  countryCode: z.string().max(3).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  contactPhone: z.string().max(30).optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactWhatsapp: z.string().max(30).optional().nullable(),
  hidePhone: z.boolean().optional(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
});

// ── Image reorder body schema ─────────────────────────────────────────

export const imageReorderSchema = z.object({
  images: z
    .array(
      z.object({
        imageId: z.string().uuid("Invalid image ID"),
        position: z.number().int().min(0, "Position must be 0 or greater"),
      })
    )
    .min(1, "At least one image is required"),
});
