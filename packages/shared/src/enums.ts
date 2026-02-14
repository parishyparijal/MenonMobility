export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

export enum ListingStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  EXPIRED = "EXPIRED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export enum VehicleCondition {
  NEW = "NEW",
  USED = "USED",
  REFURBISHED = "REFURBISHED",
}

export enum FuelType {
  DIESEL = "DIESEL",
  PETROL = "PETROL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
  LPG = "LPG",
  CNG = "CNG",
  HYDROGEN = "HYDROGEN",
}

export enum TransmissionType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
  SEMI_AUTOMATIC = "SEMI_AUTOMATIC",
}

export enum EmissionClass {
  EURO1 = "EURO1",
  EURO2 = "EURO2",
  EURO3 = "EURO3",
  EURO4 = "EURO4",
  EURO5 = "EURO5",
  EURO6 = "EURO6",
  EURO6D = "EURO6D",
}

export enum ContainerSize {
  FT20 = "FT20",
  FT40 = "FT40",
  FT45 = "FT45",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
  EXPIRED = "EXPIRED",
}

export enum ImportStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum EmailFrequency {
  NEVER = "NEVER",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

export enum AdPlacement {
  HOMEPAGE = "HOMEPAGE",
  CATEGORY = "CATEGORY",
  SEARCH = "SEARCH",
  SIDEBAR = "SIDEBAR",
}

export enum PaymentType {
  SUBSCRIPTION = "SUBSCRIPTION",
  FEATURED = "FEATURED",
  LISTING = "LISTING",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
