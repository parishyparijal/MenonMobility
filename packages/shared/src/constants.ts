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
export const SUPPORTED_CURRENCIES = ["USD", "EUR", "JPY", "GBP", "CNY", "AUD", "CAD", "CHF", "HKD", "SGD"] as const;
export const DEFAULT_CURRENCY = "USD";

export const CURRENCY_INFO: Record<string, { name: string; symbol: string; locale: string }> = {
  USD: { name: "US Dollar", symbol: "$", locale: "en-US" },
  EUR: { name: "Euro", symbol: "\u20AC", locale: "de-DE" },
  JPY: { name: "Japanese Yen", symbol: "\u00A5", locale: "ja-JP" },
  GBP: { name: "British Pound", symbol: "\u00A3", locale: "en-GB" },
  CNY: { name: "Chinese Yuan", symbol: "\u00A5", locale: "zh-CN" },
  AUD: { name: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  CAD: { name: "Canadian Dollar", symbol: "C$", locale: "en-CA" },
  CHF: { name: "Swiss Franc", symbol: "CHF", locale: "de-CH" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", locale: "en-HK" },
  SGD: { name: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
};

// Languages
export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { code: "zh", name: "\u4E2D\u6587", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  { code: "hi", name: "\u0939\u093F\u0928\u094D\u0926\u0940", flag: "\uD83C\uDDEE\uD83C\uDDF3" },
  { code: "es", name: "Espa\u00F1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { code: "fr", name: "Fran\u00E7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
  { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\uD83C\uDDF8\uD83C\uDDE6" },
  { code: "bn", name: "\u09AC\u09BE\u0982\u09B2\u09BE", flag: "\uD83C\uDDE7\uD83C\uDDE9" },
  { code: "pt", name: "Portugu\u00EAs", flag: "\uD83C\uDDE7\uD83C\uDDF7" },
  { code: "ru", name: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", flag: "\uD83C\uDDF7\uD83C\uDDFA" },
  { code: "ja", name: "\u65E5\u672C\u8A9E", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
] as const;
export const DEFAULT_LOCALE = "en";

// Subscription limits
export const PLAN_LIMITS = {
  FREE: { maxListings: 5, maxImages: 5 },
  BASIC: { maxListings: 25, maxImages: 10 },
  PREMIUM: { maxListings: 100, maxImages: 20 },
} as const;
