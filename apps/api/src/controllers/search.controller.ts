import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { elasticsearchService } from "@/services/elasticsearch.service";
import { pingElasticsearch } from "@/config/elasticsearch";

// ---------------------------------------------------------------------------
// Search Controller
// ---------------------------------------------------------------------------
// Uses Elasticsearch for full-text search with relevance scoring and
// aggregations. Falls back to Prisma if Elasticsearch is unavailable.
// ---------------------------------------------------------------------------

let esAvailable: boolean | null = null;

async function isEsAvailable(): Promise<boolean> {
  if (esAvailable === null) {
    esAvailable = await pingElasticsearch();
  }
  return esAvailable;
}

export const searchController = {
  /**
   * GET /api/search
   * Full-text search across listings with filters and aggregations.
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q,
        category,
        brand,
        model,
        condition,
        fuelType,
        transmission,
        emissionClass,
        countryCode,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        sort,
        page,
        limit,
      } = req.query as any;

      // Try Elasticsearch first
      if (await isEsAvailable()) {
        try {
          const result = await elasticsearchService.search({
            q,
            category,
            brand,
            model,
            condition,
            fuelType,
            transmission,
            emissionClass,
            countryCode,
            minPrice,
            maxPrice,
            minYear,
            maxYear,
            sort,
            page,
            limit,
          });

          return res.json({
            success: true,
            data: {
              listings: result.listings,
              aggregations: result.aggregations,
            },
            pagination: result.pagination,
          });
        } catch (esError) {
          console.error("[Search] Elasticsearch query failed, falling back to Prisma:", esError);
          // Reset availability so it re-checks next time
          esAvailable = null;
        }
      }

      // Fallback: Prisma-based search
      const where: any = {
        status: "ACTIVE",
        deletedAt: null,
      };

      if (q) {
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ];
      }

      if (category) where.category = { slug: category };
      if (brand) where.brand = { slug: brand };
      if (model) where.model = { slug: model };
      if (condition) where.condition = condition;
      if (fuelType) where.fuelType = fuelType;
      if (transmission) where.transmission = transmission;
      if (emissionClass) where.emissionClass = emissionClass;
      if (countryCode) where.countryCode = countryCode;

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      if (minYear !== undefined || maxYear !== undefined) {
        where.year = {};
        if (minYear !== undefined) where.year.gte = minYear;
        if (maxYear !== undefined) where.year.lte = maxYear;
      }

      let orderBy: any;
      switch (sort) {
        case "price_asc":
          orderBy = { price: "asc" };
          break;
        case "price_desc":
          orderBy = { price: "desc" };
          break;
        case "date_desc":
          orderBy = { publishedAt: "desc" };
          break;
        case "date_asc":
          orderBy = { publishedAt: "asc" };
          break;
        case "year_desc":
          orderBy = { year: "desc" };
          break;
        case "year_asc":
          orderBy = { year: "asc" };
          break;
        case "relevance":
        default:
          orderBy = { publishedAt: "desc" };
          break;
      }

      const skip = (page - 1) * limit;

      const [listings, total, categoryAgg, brandAgg, conditionAgg, fuelTypeAgg, countryAgg] =
        await Promise.all([
          prisma.listing.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              priceCurrency: true,
              priceOnRequest: true,
              condition: true,
              year: true,
              mileageKm: true,
              fuelType: true,
              transmission: true,
              powerHp: true,
              countryCode: true,
              city: true,
              isFeatured: true,
              favoriteCount: true,
              publishedAt: true,
              createdAt: true,
              category: {
                select: { id: true, name: true, slug: true },
              },
              brand: {
                select: { id: true, name: true, slug: true },
              },
              model: {
                select: { id: true, name: true, slug: true },
              },
              images: {
                take: 1,
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  thumbnailUrl: true,
                  mediumUrl: true,
                  originalUrl: true,
                  altText: true,
                },
              },
            },
          }),
          prisma.listing.count({ where }),
          prisma.listing.groupBy({
            by: ["categoryId"],
            where: { ...where, category: undefined },
            _count: { id: true },
          }),
          prisma.listing.groupBy({
            by: ["brandId"],
            where: { ...where, brand: undefined },
            _count: { id: true },
          }),
          prisma.listing.groupBy({
            by: ["condition"],
            where,
            _count: { id: true },
          }),
          prisma.listing.groupBy({
            by: ["fuelType"],
            where,
            _count: { id: true },
          }),
          prisma.listing.groupBy({
            by: ["countryCode"],
            where: { ...where, countryCode: undefined },
            _count: { id: true },
          }),
        ]);

      const categoryIds = categoryAgg.map((c) => c.categoryId);
      const categories = categoryIds.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true, slug: true },
          })
        : [];
      const categoryMap = new Map(categories.map((c) => [c.id, c]));

      const brandIds = brandAgg.filter((b) => b.brandId !== null).map((b) => b.brandId!);
      const brands = brandIds.length > 0
        ? await prisma.brand.findMany({
            where: { id: { in: brandIds } },
            select: { id: true, name: true, slug: true },
          })
        : [];
      const brandMap = new Map(brands.map((b) => [b.id, b]));

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          listings,
          aggregations: {
            categories: categoryAgg.map((c) => ({
              ...categoryMap.get(c.categoryId),
              count: c._count.id,
            })),
            brands: brandAgg
              .filter((b) => b.brandId !== null)
              .map((b) => ({
                ...brandMap.get(b.brandId!),
                count: b._count.id,
              })),
            conditions: conditionAgg.map((c) => ({
              value: c.condition,
              count: c._count.id,
            })),
            fuelTypes: fuelTypeAgg
              .filter((f) => f.fuelType !== null)
              .map((f) => ({
                value: f.fuelType,
                count: f._count.id,
              })),
            countries: countryAgg
              .filter((c) => c.countryCode !== null)
              .map((c) => ({
                value: c.countryCode,
                count: c._count.id,
              })),
          },
        },
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/search/suggestions
   * Autocomplete: return up to 8 unique title matches.
   */
  async suggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query as any;

      if (!q) {
        throw new AppError("Search query (q) is required", 400);
      }

      // Try Elasticsearch first
      if (await isEsAvailable()) {
        try {
          const results = await elasticsearchService.suggestions(q, 8);
          return res.json({ success: true, data: results });
        } catch (esError) {
          console.error("[Search] ES suggestions failed, falling back to Prisma:", esError);
          esAvailable = null;
        }
      }

      // Fallback: Prisma
      const listings = await prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          deletedAt: null,
          title: { contains: q, mode: "insensitive" },
        },
        select: { title: true },
        take: 50,
        orderBy: { publishedAt: "desc" },
      });

      const seen = new Set<string>();
      const suggestions: string[] = [];
      for (const listing of listings) {
        const lower = listing.title.toLowerCase();
        if (!seen.has(lower) && suggestions.length < 8) {
          seen.add(lower);
          suggestions.push(listing.title);
        }
      }

      res.json({ success: true, data: suggestions });
    } catch (error) {
      next(error);
    }
  },
};
