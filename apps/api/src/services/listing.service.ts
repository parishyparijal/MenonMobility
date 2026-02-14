import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Listing Service — helpers for slug generation, query building, selects
// ---------------------------------------------------------------------------

export const listingService = {
  /**
   * Generate a URL-friendly slug from a title with a short unique ID appended.
   * Example: "Volvo FH16 750" -> "volvo-fh16-750-a1b2c3d4"
   */
  generateSlug(title: string): string {
    const base = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });
    const shortId = uuidv4().replace(/-/g, "").slice(0, 8);
    return `${base}-${shortId}`;
  },

  /**
   * Build a Prisma `where` clause from listing query/filter parameters.
   */
  buildListingWhere(filters: {
    category?: string;
    brand?: string;
    model?: string;
    condition?: string;
    fuelType?: string;
    transmission?: string;
    emissionClass?: string;
    countryCode?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    minMileage?: number;
    maxMileage?: number;
    sellerId?: string;
    status?: string;
  }): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = {};

    // Always exclude soft-deleted
    where.deletedAt = null;

    // Category filter (by slug or id)
    if (filters.category) {
      where.category = { slug: filters.category };
    }

    // Brand filter (by slug or id)
    if (filters.brand) {
      where.brand = { slug: filters.brand };
    }

    // Model filter (by slug or id)
    if (filters.model) {
      where.model = { slug: filters.model };
    }

    // Enum filters
    if (filters.condition) {
      where.condition = filters.condition as any;
    }
    if (filters.fuelType) {
      where.fuelType = filters.fuelType as any;
    }
    if (filters.transmission) {
      where.transmission = filters.transmission as any;
    }
    if (filters.emissionClass) {
      where.emissionClass = filters.emissionClass as any;
    }

    // Location filter
    if (filters.countryCode) {
      where.countryCode = filters.countryCode;
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Year range
    if (filters.minYear !== undefined || filters.maxYear !== undefined) {
      where.year = {};
      if (filters.minYear !== undefined) {
        where.year.gte = filters.minYear;
      }
      if (filters.maxYear !== undefined) {
        where.year.lte = filters.maxYear;
      }
    }

    // Mileage range
    if (filters.minMileage !== undefined || filters.maxMileage !== undefined) {
      where.mileageKm = {};
      if (filters.minMileage !== undefined) {
        where.mileageKm.gte = filters.minMileage;
      }
      if (filters.maxMileage !== undefined) {
        where.mileageKm.lte = filters.maxMileage;
      }
    }

    // Seller filter (for seller's own listings)
    if (filters.sellerId) {
      where.sellerId = filters.sellerId;
    }

    // Status filter
    if (filters.status) {
      if (filters.status === "all") {
        // No status filter — show all (except soft-deleted, handled above)
      } else {
        where.status = filters.status as any;
      }
    }

    return where;
  },

  /**
   * Build a Prisma `orderBy` clause from a sort string parameter.
   */
  buildListingOrderBy(
    sort?: string
  ): Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[] {
    switch (sort) {
      case "price_asc":
        return { price: "asc" };
      case "price_desc":
        return { price: "desc" };
      case "year_desc":
        return { year: "desc" };
      case "mileage_asc":
        return { mileageKm: "asc" };
      case "oldest":
        return { createdAt: "asc" };
      case "newest":
      default:
        return { createdAt: "desc" };
    }
  },

  /**
   * Return Prisma select/include objects for list view vs detail view.
   *
   * List view: minimal fields + first image + seller name + category name.
   * Detail view: all fields + all relations.
   */
  getListingSelect(detail: boolean) {
    if (detail) {
      return {
        include: {
          images: {
            orderBy: { position: "asc" as const },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              phone: true,
              whatsapp: true,
              createdAt: true,
              sellerProfile: {
                select: {
                  id: true,
                  companyName: true,
                  slug: true,
                  description: true,
                  website: true,
                  city: true,
                  region: true,
                  countryCode: true,
                  logoUrl: true,
                  isVerified: true,
                  rating: true,
                  reviewCount: true,
                  responseRate: true,
                  avgResponseTime: true,
                },
              },
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
          model: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          specifications: {
            include: {
              specKey: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  unit: true,
                },
              },
            },
          },
        },
      };
    }

    // List view — lightweight
    return {
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        priceCurrency: true,
        priceOnRequest: true,
        priceNegotiable: true,
        condition: true,
        status: true,
        year: true,
        mileageKm: true,
        operatingHours: true,
        fuelType: true,
        transmission: true,
        powerHp: true,
        countryCode: true,
        region: true,
        city: true,
        viewCount: true,
        favoriteCount: true,
        imageCount: true,
        isFeatured: true,
        createdAt: true,
        publishedAt: true,
        expiresAt: true,
        images: {
          take: 1,
          orderBy: { position: "asc" as const },
          select: {
            id: true,
            thumbnailUrl: true,
            mediumUrl: true,
            originalUrl: true,
            altText: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            sellerProfile: {
              select: {
                companyName: true,
                slug: true,
                isVerified: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    };
  },
};
