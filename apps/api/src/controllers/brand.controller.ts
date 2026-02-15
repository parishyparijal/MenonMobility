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

  // ── Admin CRUD ──────────────────────────────────────────────────────

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug, logoUrl, isActive, categoryIds } = req.body;

      const existing = await prisma.brand.findUnique({ where: { slug } });
      if (existing) throw new AppError("A brand with this slug already exists", 409);

      const brand = await prisma.brand.create({
        data: {
          name, slug, logoUrl: logoUrl || null, isActive: isActive ?? true,
          ...(categoryIds && categoryIds.length > 0 && {
            brandCategories: { create: categoryIds.map((cId: string) => ({ categoryId: cId })) },
          }),
        },
      });

      res.status(201).json({ success: true, data: brand, message: "Brand created" });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, slug, logoUrl, isActive, categoryIds } = req.body;

      const existing = await prisma.brand.findUnique({ where: { id } });
      if (!existing) throw new AppError("Brand not found", 404);

      if (slug && slug !== existing.slug) {
        const slugTaken = await prisma.brand.findUnique({ where: { slug } });
        if (slugTaken) throw new AppError("A brand with this slug already exists", 409);
      }

      const brand = await prisma.brand.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      if (categoryIds !== undefined) {
        await prisma.brandCategory.deleteMany({ where: { brandId: id } });
        if (categoryIds.length > 0) {
          await prisma.brandCategory.createMany({
            data: categoryIds.map((cId: string) => ({ brandId: id, categoryId: cId })),
          });
        }
      }

      res.json({ success: true, data: brand, message: "Brand updated" });
    } catch (error) { next(error); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      const brand = await prisma.brand.findUnique({
        where: { id },
        include: { _count: { select: { listings: true } } },
      });

      if (!brand) throw new AppError("Brand not found", 404);
      if (brand._count.listings > 0) {
        throw new AppError(`Cannot delete brand with ${brand._count.listings} listings. Reassign listings first.`, 400);
      }

      await prisma.brandCategory.deleteMany({ where: { brandId: id } });
      await prisma.brandModel.deleteMany({ where: { brandId: id } });
      await prisma.brand.delete({ where: { id } });

      res.json({ success: true, message: "Brand deleted" });
    } catch (error) { next(error); }
  },

  async createModel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, slug, isActive } = req.body;

      const brand = await prisma.brand.findUnique({ where: { id } });
      if (!brand) throw new AppError("Brand not found", 404);

      const existing = await prisma.brandModel.findFirst({ where: { slug } });
      if (existing) throw new AppError("A model with this slug already exists", 409);

      const model = await prisma.brandModel.create({
        data: { brandId: id, name, slug, isActive: isActive ?? true },
      });

      res.status(201).json({ success: true, data: model, message: "Model created" });
    } catch (error) { next(error); }
  },

  async updateModel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const modelId = req.params.modelId as string;
      const { name, slug, isActive } = req.body;

      const model = await prisma.brandModel.findUnique({ where: { id: modelId } });
      if (!model || model.brandId !== id) throw new AppError("Model not found", 404);

      if (slug && slug !== model.slug) {
        const slugTaken = await prisma.brandModel.findFirst({ where: { slug } });
        if (slugTaken) throw new AppError("A model with this slug already exists", 409);
      }

      const updated = await prisma.brandModel.update({
        where: { id: modelId },
        data: {
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({ success: true, data: updated, message: "Model updated" });
    } catch (error) { next(error); }
  },

  async deleteModel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const modelId = req.params.modelId as string;

      const model = await prisma.brandModel.findUnique({
        where: { id: modelId },
        include: { _count: { select: { listings: true } } },
      });

      if (!model || model.brandId !== id) throw new AppError("Model not found", 404);
      if (model._count.listings > 0) {
        throw new AppError(`Cannot delete model with ${model._count.listings} listings. Reassign listings first.`, 400);
      }

      await prisma.brandModel.delete({ where: { id: modelId } });

      res.json({ success: true, message: "Model deleted" });
    } catch (error) { next(error); }
  },
};
