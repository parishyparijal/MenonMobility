import {
  UserRole,
  ListingStatus,
  VehicleCondition,
  FuelType,
  TransmissionType,
  EmissionClass,
} from "./enums";

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole.BUYER | UserRole.SELLER;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  whatsapp?: string;
  avatarUrl?: string;
  locale: string;
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  sellerProfile?: SellerProfile;
}

// Seller
export interface SellerProfile {
  id: string;
  userId: string;
  companyName: string;
  slug: string;
  description?: string;
  website?: string;
  address?: string;
  city?: string;
  region?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  logoUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
  responseRate?: number;
  avgResponseTime?: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// Category
export interface Category {
  id: string;
  parentId?: string;
  name: Record<string, string>;
  slug: string;
  description?: Record<string, string>;
  icon?: string;
  imageUrl?: string;
  sortOrder: number;
  listingCount: number;
  isActive: boolean;
  children?: Category[];
}

// Brand
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  models?: BrandModel[];
}

export interface BrandModel {
  id: string;
  brandId: string;
  name: string;
  slug: string;
}

// Listing
export interface Listing {
  id: string;
  sellerId: string;
  categoryId: string;
  brandId?: string;
  modelId?: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  priceCurrency: string;
  priceOnRequest: boolean;
  priceNegotiable: boolean;
  condition: VehicleCondition;
  status: ListingStatus;
  year?: number;
  mileageKm?: number;
  operatingHours?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  powerHp?: number;
  powerKw?: number;
  color?: string;
  vin?: string;
  gvwKg?: number;
  payloadKg?: number;
  axleCount?: number;
  cabType?: string;
  emissionClass?: EmissionClass;
  countryCode?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  hidePhone: boolean;
  viewCount: number;
  favoriteCount: number;
  contactCount: number;
  imageCount: number;
  isFeatured: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  images?: ListingImage[];
  category?: Category;
  brand?: Brand;
  model?: BrandModel;
  seller?: User;
}

// Listing card (lighter version for lists)
export interface ListingCard {
  id: string;
  title: string;
  slug: string;
  price?: number;
  priceCurrency: string;
  priceOnRequest: boolean;
  priceNegotiable: boolean;
  condition: VehicleCondition;
  year?: number;
  mileageKm?: number;
  fuelType?: FuelType;
  countryCode?: string;
  city?: string;
  isFeatured: boolean;
  imageUrl?: string;
  sellerName?: string;
  sellerVerified?: boolean;
}

export interface ListingImage {
  id: string;
  position: number;
  originalUrl: string;
  largeUrl?: string;
  mediumUrl?: string;
  thumbnailUrl?: string;
  webpUrl?: string;
  altText?: string;
}

// Search
export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  model?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  condition?: VehicleCondition[];
  fuelType?: FuelType[];
  transmission?: TransmissionType[];
  country?: string[];
  emissionClass?: EmissionClass;
  mileageMin?: number;
  mileageMax?: number;
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface SearchAggregations {
  brands: AggregationBucket[];
  categories: AggregationBucket[];
  fuelTypes: AggregationBucket[];
  conditions: AggregationBucket[];
  countries: AggregationBucket[];
  priceRanges: AggregationBucket[];
  yearRanges: AggregationBucket[];
}

export interface AggregationBucket {
  key: string;
  count: number;
  label?: string;
}

// Messaging
export interface MessageThread {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessageAt: string;
  listing?: { title: string; slug: string; imageUrl?: string };
  otherParty?: { id: string; name: string; avatarUrl?: string };
  lastMessage?: { body: string; senderId: string };
  unreadCount: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  attachments?: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
