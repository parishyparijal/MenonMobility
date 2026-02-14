import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Notification Controller
// All routes require authentication
// ---------------------------------------------------------------------------

export const notificationController = {
  /**
   * GET /api/notifications
   * Get user's notifications, paginated, newest first.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));

      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            type: true,
            title: true,
            body: true,
            data: true,
            isRead: true,
            readAt: true,
            createdAt: true,
          },
        }),
        prisma.notification.count({ where: { userId } }),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: notifications,
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
   * PATCH /api/notifications/:id/read
   * Mark a single notification as read.
   */
  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new AppError("Notification not found", 404);
      }

      if (notification.userId !== userId) {
        throw new AppError("You do not have access to this notification", 403);
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date(),
        },
        select: {
          id: true,
          type: true,
          title: true,
          body: true,
          data: true,
          isRead: true,
          readAt: true,
          createdAt: true,
        },
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/notifications/read-all
   * Mark all user's unread notifications as read.
   */
  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      res.json({
        success: true,
        data: { updatedCount: result.count },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/notifications/unread-count
   * Return unread notification count for the user.
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  },
};
