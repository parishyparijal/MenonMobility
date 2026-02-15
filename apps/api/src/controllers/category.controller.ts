import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Category Controller
// ---------------------------------------------------------------------------

/**
 * Build a tree structure from a flat list of categories.
 * Each root-level category will have its `children` array populated.
 */
function buildCategoryTree(
  categories: Array<{
    id: string;
    parentId: string | null;
    name: unknown;
    slug: string;
    description: unknown;
    icon: string | null;
    imageUrl: string | null;
    sortOrder: number;
    listingCount: number;
    isActive: boolean;
    children?: unknown[];
    _count?: { listings: number };
  }>
) {
  const map = new Map<string, any>();
  const roots: any[] = [];

  // First pass: create a map of all categories
  for (const cat of categories) {
    map.set(cat.id, {
      id: cat.id,
      parentId: cat.parentId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      imageUrl: cat.imageUrl,
      sortOrder: cat.sortOrder,
      listingCount: cat.listingCount,
      isActive: cat.isActive,
      children: [],
    });
  }

  // Second pass: build parent-child relationships
  for (const cat of categories) {
    const node = map.get(cat.id);
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort children at each level
  const sortChildren = (nodes: any[]) => {
    nodes.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children);
      }
    }
  };
  sortChildren(roots);

  return roots;
}

export const categoryController = {
  /**
   * GET /api/categories
   * Get all categories. Returns a tree structure by default.
   * Pass ?flat=true to get a flat list instead.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const flat = req.query.flat === true || req.query.flat === "true";
      const active =
        req.query.active === undefined || req.query.active === true || req.query.active === "true";

      const where: any = {};
      if (active) {
        where.isActive = true;
      }

      const categories = await prisma.category.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          parentId: true,
          name: true,
          slug: true,
          description: true,
          icon: true,
          imageUrl: true,
          sortOrder: true,
          listingCount: true,
          isActive: true,
        },
      });

      if (flat) {
        res.json({
          success: true,
          data: categories,
        });
        return;
      }

      // Build tree structure
      const tree = buildCategoryTree(categories);

      // Set cache headers (5 minutes)
      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data: tree,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/categories/:slug
   * Get a single category by slug, including its children, parent, and linked brands.
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              icon: true,
              imageUrl: true,
              sortOrder: true,
              listingCount: true,
            },
          },
          brandCategories: {
            include: {
              brand: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logoUrl: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!category) {
        throw new AppError("Category not found", 404);
      }

      // Extract brands from the pivot table
      const brands = category.brandCategories
        .filter((bc) => bc.brand.isActive)
        .map((bc) => bc.brand);

      // Build response without the raw pivot data
      const { brandCategories: _, ...categoryData } = category;

      // Set cache headers (5 minutes)
      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data: {
          ...categoryData,
          brands,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // ── Admin CRUD ──────────────────────────────────────────────────────

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug, description, icon, imageUrl, parentId, sortOrder, isActive } = req.body;

      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        throw new AppError("A category with this slug already exists", 409);
      }

      if (parentId) {
        const parent = await prisma.category.findUnique({ where: { id: parentId } });
        if (!parent) throw new AppError("Parent category not found", 404);
      }

      const category = await prisma.category.create({
        data: { name, slug, description: description || null, icon: icon || null, imageUrl: imageUrl || null, parentId: parentId || null, sortOrder: sortOrder ?? 0, isActive: isActive ?? true },
      });

      res.status(201).json({ success: true, data: category, message: "Category created" });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, slug, description, icon, imageUrl, parentId, sortOrder, isActive } = req.body;

      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) throw new AppError("Category not found", 404);

      if (slug && slug !== existing.slug) {
        const slugTaken = await prisma.category.findUnique({ where: { slug } });
        if (slugTaken) throw new AppError("A category with this slug already exists", 409);
      }

      if (parentId === id) throw new AppError("Category cannot be its own parent", 400);

      const category = await prisma.category.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(description !== undefined && { description }),
          ...(icon !== undefined && { icon }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(parentId !== undefined && { parentId }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({ success: true, data: category, message: "Category updated" });
    } catch (error) { next(error); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      const category = await prisma.category.findUnique({
        where: { id },
        include: { children: { select: { id: true } }, _count: { select: { listings: true } } },
      });

      if (!category) throw new AppError("Category not found", 404);

      if (category._count.listings > 0) {
        throw new AppError(`Cannot delete category with ${category._count.listings} listings. Reassign listings first.`, 400);
      }

      if (category.children.length > 0) {
        await prisma.category.updateMany({ where: { parentId: id }, data: { parentId: category.parentId } });
      }

      await prisma.brandCategory.deleteMany({ where: { categoryId: id } });
      await prisma.category.delete({ where: { id } });

      res.json({ success: true, message: "Category deleted" });
    } catch (error) { next(error); }
  },

  /**
   * GET /api/categories/:slug/filters
   * Get available filter options for a category, derived from active listings.
   */
  async getFilters(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      // Resolve category and all its child IDs
      const category = await prisma.category.findUnique({
        where: { slug },
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

      // Include parent and all children for filter aggregation
      const categoryIds = [
        category.id,
        ...category.children.map((c) => c.id),
      ];

      // Run all filter aggregations in parallel
      const [
        brandsResult,
        priceResult,
        fuelTypeResult,
        conditionResult,
        transmissionResult,
        yearResult,
        emissionClassResult,
        countryResult,
      ] = await Promise.all([
        // 1. Brands with listing count
        prisma.listing.groupBy({
          by: ["brandId"],
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            brandId: { not: null },
          },
          _count: { id: true },
        }),

        // 2. Price range
        prisma.listing.aggregate({
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            price: { not: null },
          },
          _min: { price: true },
          _max: { price: true },
        }),

        // 3. Fuel types
        prisma.listing.groupBy({
          by: ["fuelType"],
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            fuelType: { not: null },
          },
          _count: { id: true },
        }),

        // 4. Conditions
        prisma.listing.groupBy({
          by: ["condition"],
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
          },
          _count: { id: true },
        }),

        // 5. Transmission types
        prisma.listing.groupBy({
          by: ["transmission"],
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            transmission: { not: null },
          },
          _count: { id: true },
        }),

        // 6. Year range
        prisma.listing.aggregate({
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            year: { not: null },
          },
          _min: { year: true },
          _max: { year: true },
        }),

        // 7. Emission classes
        prisma.listing.groupBy({
          by: ["emissionClass"],
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            emissionClass: { not: null },
          },
          _count: { id: true },
        }),

        // 8. Countries
        prisma.listing.groupBy({
          by: ["countryCode"],
          where: {
            categoryId: { in: categoryIds },
            status: "ACTIVE",
            deletedAt: null,
            countryCode: { not: null },
          },
          _count: { id: true },
        }),
      ]);

      // Fetch brand details for the grouped brand IDs
      const brandIds = brandsResult
        .filter((b) => b.brandId !== null)
        .map((b) => b.brandId as string);

      const brands = brandIds.length > 0
        ? await prisma.brand.findMany({
            where: { id: { in: brandIds }, isActive: true },
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          })
        : [];

      // Map listing counts to brands
      const brandCountMap = new Map(
        brandsResult.map((b) => [b.brandId, b._count.id])
      );

      const brandsWithCount = brands
        .map((brand) => ({
          ...brand,
          listingCount: brandCountMap.get(brand.id) || 0,
        }))
        .sort((a, b) => b.listingCount - a.listingCount);

      // Build filter response
      const filters = {
        brands: brandsWithCount,
        priceRange: {
          min: priceResult._min.price || 0,
          max: priceResult._max.price || 0,
          currency: "EUR",
        },
        fuelTypes: fuelTypeResult.map((ft) => ({
          value: ft.fuelType,
          count: ft._count.id,
        })),
        conditions: conditionResult.map((c) => ({
          value: c.condition,
          count: c._count.id,
        })),
        transmissions: transmissionResult.map((t) => ({
          value: t.transmission,
          count: t._count.id,
        })),
        yearRange: {
          min: yearResult._min.year || 0,
          max: yearResult._max.year || 0,
        },
        emissionClasses: emissionClassResult.map((ec) => ({
          value: ec.emissionClass,
          count: ec._count.id,
        })),
        countries: countryResult.map((c) => ({
          value: c.countryCode,
          count: c._count.id,
        })),
      };

      // Set cache headers (2 minutes — filters change more frequently)
      res.set("Cache-Control", "public, max-age=120, s-maxage=120");

      res.json({
        success: true,
        data: filters,
      });
    } catch (error) {
      next(error);
    }
  },
};
