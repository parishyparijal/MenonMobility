import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Brand Controller
// ---------------------------------------------------------------------------

export const brandController = {
  /**
   * GET /api/brands
   * Get all active brands. Supports ?category=slug to filter by category.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categorySlug = req.query.category as string | undefined;
      const active =
        req.query.active === undefined || req.query.active === true || req.query.active === "true";

      const where: any = {};
      if (active) {
        where.isActive = true;
      }

      // If filtering by category, find brands linked to that category
      if (categorySlug) {
        const category = await prisma.category.findUnique({
          where: { slug: categorySlug },
          include: {
            children: {
              where: { isActive: true },
              select: { id: true },
            },
          },
        });

        if (!category) {
          throw new AppError("Category not found", 404);
        }

        // Include parent category and all children
        const categoryIds = [
          category.id,
          ...category.children.map((c) => c.id),
        ];

        where.brandCategories = {
          some: {
            categoryId: { in: categoryIds },
          },
        };
      }

      const brands = await prisma.brand.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          isActive: true,
          _count: {
            select: {
              listings: {
                where: {
                  status: "ACTIVE",
                  deletedAt: null,
                },
              },
              models: {
                where: { isActive: true },
              },
            },
          },
        },
      });

      // Flatten the _count field for a cleaner response
      const data = brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        isActive: brand.isActive,
        listingCount: brand._count.listings,
        modelCount: brand._count.models,
      }));

      // Set cache headers (5 minutes)
      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/brands/:slug
   * Get a single brand by slug with its models and listing count per model.
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const brand = await prisma.brand.findUnique({
        where: { slug },
        include: {
          models: {
            where: { isActive: true },
            orderBy: { name: "asc" },
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true,
              _count: {
                select: {
                  listings: {
                    where: {
                      status: "ACTIVE",
                      deletedAt: null,
                    },
                  },
                },
              },
            },
          },
          brandCategories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  icon: true,
                },
              },
            },
          },
          _count: {
            select: {
              listings: {
                where: {
                  status: "ACTIVE",
                  deletedAt: null,
                },
              },
            },
          },
        },
      });

      if (!brand) {
        throw new AppError("Brand not found", 404);
      }

      // Flatten model _count for cleaner response
      const models = brand.models.map((model) => ({
        id: model.id,
        name: model.name,
        slug: model.slug,
        isActive: model.isActive,
        listingCount: model._count.listings,
      }));

      // Extract categories from pivot table
      const categories = brand.brandCategories.map((bc) => bc.category);

      // Set cache headers (5 minutes)
      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data: {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logoUrl: brand.logoUrl,
          isActive: brand.isActive,
          listingCount: brand._count.listings,
          models,
          categories,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
