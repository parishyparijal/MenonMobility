import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

export const savedSearchController = {
  /**
   * GET /api/saved-searches
   * List current user's saved searches.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { page, limit } = req.query as any;
      const skip = (page - 1) * limit;

      const [searches, total] = await Promise.all([
        prisma.savedSearch.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.savedSearch.count({ where: { userId } }),
      ]);

      res.json({
        success: true,
        data: searches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/saved-searches
   * Create a new saved search.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { name, filters, emailFrequency } = req.body;

      const search = await prisma.savedSearch.create({
        data: {
          userId,
          name,
          filters,
          emailFrequency,
        },
      });

      res.status(201).json({
        success: true,
        data: search,
        message: "Saved search created",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/saved-searches/:id
   * Update saved search name or email frequency.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const { name, emailFrequency } = req.body;

      const existing = await prisma.savedSearch.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== userId) {
        throw new AppError("Saved search not found", 404);
      }

      const updated = await prisma.savedSearch.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(emailFrequency !== undefined && { emailFrequency }),
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Saved search updated",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/saved-searches/:id
   * Delete a saved search.
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const existing = await prisma.savedSearch.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== userId) {
        throw new AppError("Saved search not found", 404);
      }

      await prisma.savedSearch.delete({ where: { id } });

      res.json({
        success: true,
        message: "Saved search deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};
