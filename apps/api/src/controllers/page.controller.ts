import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Page Controller (CMS)
// ---------------------------------------------------------------------------

export const pageController = {
  /**
   * GET /api/pages
   * Get all published pages (public).
   */
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const pages = await prisma.page.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          isPublished: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data: pages,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/pages/:slug
   * Get a single page by slug (public). Must be published.
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const page = await prisma.page.findUnique({
        where: { slug },
      });

      if (!page || !page.isPublished) {
        throw new AppError("Page not found", 404);
      }

      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/pages
   * All pages including unpublished (admin only).
   */
  async adminList(_req: Request, res: Response, next: NextFunction) {
    try {
      const pages = await prisma.page.findMany({
        orderBy: { sortOrder: "asc" },
      });

      res.json({
        success: true,
        data: pages,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/admin/pages
   * Create a new CMS page (admin only).
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug, title, body, isPublished, sortOrder } = req.body;

      // Check for duplicate slug
      const existing = await prisma.page.findUnique({
        where: { slug },
      });

      if (existing) {
        throw new AppError(`A page with slug "${slug}" already exists`, 409);
      }

      const page = await prisma.page.create({
        data: {
          slug,
          title,
          body,
          isPublished: isPublished ?? false,
          sortOrder: sortOrder ?? 0,
        },
      });

      res.status(201).json({
        success: true,
        data: page,
        message: "Page created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admin/pages/:id
   * Update an existing CMS page (admin only).
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { slug, title, body, isPublished, sortOrder } = req.body;

      const existing = await prisma.page.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new AppError("Page not found", 404);
      }

      // If slug is being changed, check for duplicates
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.page.findUnique({
          where: { slug },
        });

        if (slugExists) {
          throw new AppError(`A page with slug "${slug}" already exists`, 409);
        }
      }

      const page = await prisma.page.update({
        where: { id },
        data: {
          ...(slug !== undefined && { slug }),
          ...(title !== undefined && { title }),
          ...(body !== undefined && { body }),
          ...(isPublished !== undefined && { isPublished }),
          ...(sortOrder !== undefined && { sortOrder }),
        },
      });

      res.json({
        success: true,
        data: page,
        message: "Page updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/admin/pages/:id
   * Delete a CMS page (admin only).
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.page.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new AppError("Page not found", 404);
      }

      await prisma.page.delete({ where: { id } });

      res.json({
        success: true,
        message: `Page "${existing.slug}" deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};
