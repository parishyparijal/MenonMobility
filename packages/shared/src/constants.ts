// Brand Colors
export const COLORS = {
  primary: "#1E3A5F",
  accent: "#F59E0B",
  background: "#F5F6F7",
  white: "#FFFFFF",
  text: "#222222",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;

// Images
export const MAX_IMAGES_PER_LISTING = 20;
export const MAX_IMAGE_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];

// Listings
export const LISTING_EXPIRY_DAYS = 90;
export const MAX_COMPARE_LISTINGS = 4;

// Currencies
export const SUPPORTED_CURRENCIES = ["EUR", "GBP", "USD"] as const;
export const DEFAULT_CURRENCY = "EUR";

// Languages
export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
] as const;
export const DEFAULT_LOCALE = "en";

// Subscription limits
export const PLAN_LIMITS = {
  FREE: { maxListings: 5, maxImages: 5 },
  BASIC: { maxListings: 25, maxImages: 10 },
  PREMIUM: { maxListings: 100, maxImages: 20 },
} as const;
