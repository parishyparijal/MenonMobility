import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";

// ---------------------------------------------------------------------------
// Payment Controller — Billing history
// ---------------------------------------------------------------------------

export const paymentController = {
  /**
   * GET /api/payments
   * List the current user's payment history (billing).
   * Supports pagination via ?page=1&limit=20
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
      const skip = (page - 1) * limit;

      const type = req.query.type as string | undefined;

      const where: any = { userId };
      if (type) {
        where.type = type;
      }

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.payment.count({ where }),
      ]);

      res.json({
        success: true,
        data: payments,
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
   * GET /api/payments/:id
   * Get a single payment detail.
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const payment = await prisma.payment.findUnique({
        where: { id },
      });

      if (!payment || payment.userId !== userId) {
        res.status(404).json({ success: false, message: "Payment not found" });
        return;
      }

      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  },
};
