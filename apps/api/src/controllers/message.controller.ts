import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Message Controller
// All routes require authentication
// ---------------------------------------------------------------------------

export const messageController = {
  /**
   * GET /api/messages
   * List user's message threads with other party info, listing details,
   * last message preview, unread count.
   */
  async listThreads(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { archived, page, limit } = req.query as any;

      const skip = (page - 1) * limit;

      // Build where clause depending on whether user is buyer or seller
      const where: any = {
        OR: [
          {
            buyerId: userId,
            isArchivedBuyer: archived,
          },
          {
            sellerId: userId,
            isArchivedSeller: archived,
          },
        ],
      };

      const [threads, total] = await Promise.all([
        prisma.messageThread.findMany({
          where,
          orderBy: { lastMessageAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            lastMessageAt: true,
            isArchivedBuyer: true,
            isArchivedSeller: true,
            createdAt: true,
            listing: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                priceCurrency: true,
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                  select: {
                    id: true,
                    thumbnailUrl: true,
                    mediumUrl: true,
                    originalUrl: true,
                  },
                },
              },
            },
            buyer: {
              select: { id: true, name: true, avatarUrl: true },
            },
            seller: {
              select: { id: true, name: true, avatarUrl: true },
            },
            messages: {
              take: 1,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                body: true,
                senderId: true,
                isRead: true,
                createdAt: true,
              },
            },
          },
        }),
        prisma.messageThread.count({ where }),
      ]);

      // Enrich threads with otherParty and unread count
      const enrichedThreads = await Promise.all(
        threads.map(async (thread) => {
          const isBuyer = thread.buyer.id === userId;
          const otherParty = isBuyer ? thread.seller : thread.buyer;

          // Count unread messages in this thread (messages not sent by user and not read)
          const unreadCount = await prisma.message.count({
            where: {
              threadId: thread.id,
              senderId: { not: userId },
              isRead: false,
            },
          });

          const lastMessage = thread.messages[0] || null;

          return {
            id: thread.id,
            lastMessageAt: thread.lastMessageAt,
            createdAt: thread.createdAt,
            listing: thread.listing,
            otherParty,
            lastMessage,
            unreadCount,
          };
        })
      );

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: enrichedThreads,
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
   * GET /api/messages/:threadId
   * Get all messages in a thread (paginated, oldest first).
   * Marks unread messages as read.
   */
  async getThread(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { threadId } = req.params;
      const { page, limit } = req.query as any;

      // Verify user belongs to this thread
      const thread = await prisma.messageThread.findUnique({
        where: { id: threadId },
        select: {
          id: true,
          buyerId: true,
          sellerId: true,
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          buyer: {
            select: { id: true, name: true, avatarUrl: true },
          },
          seller: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      if (!thread) {
        throw new AppError("Thread not found", 404);
      }

      if (thread.buyerId !== userId && thread.sellerId !== userId) {
        throw new AppError("You do not have access to this thread", 403);
      }

      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        prisma.message.findMany({
          where: { threadId },
          orderBy: { createdAt: "asc" },
          skip,
          take: limit,
          select: {
            id: true,
            senderId: true,
            body: true,
            attachments: true,
            isRead: true,
            readAt: true,
            createdAt: true,
            sender: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        }),
        prisma.message.count({ where: { threadId } }),
      ]);

      // Mark unread messages from the other party as read
      await prisma.message.updateMany({
        where: {
          threadId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      const totalPages = Math.ceil(total / limit);
      const isBuyer = thread.buyerId === userId;
      const otherParty = isBuyer ? thread.seller : thread.buyer;

      res.json({
        success: true,
        data: {
          thread: {
            id: thread.id,
            listing: thread.listing,
            otherParty,
          },
          messages,
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
   * POST /api/messages
   * Send a message. Either add to existing thread (threadId) or create new thread (listingId).
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { threadId, listingId, body } = req.body;

      let resolvedThreadId: string;

      if (threadId) {
        // Add to existing thread — verify user belongs to it
        const thread = await prisma.messageThread.findUnique({
          where: { id: threadId },
          select: { id: true, buyerId: true, sellerId: true },
        });

        if (!thread) {
          throw new AppError("Thread not found", 404);
        }

        if (thread.buyerId !== userId && thread.sellerId !== userId) {
          throw new AppError("You do not have access to this thread", 403);
        }

        resolvedThreadId = thread.id;
      } else {
        // New conversation — find or create thread for this listing
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
          select: { id: true, sellerId: true, status: true },
        });

        if (!listing) {
          throw new AppError("Listing not found", 404);
        }

        // Can't message own listing
        if (listing.sellerId === userId) {
          throw new AppError("You cannot message your own listing", 400);
        }

        // Check if thread already exists between this buyer and seller for this listing
        const existingThread = await prisma.messageThread.findUnique({
          where: {
            listingId_buyerId_sellerId: {
              listingId: listing.id,
              buyerId: userId,
              sellerId: listing.sellerId,
            },
          },
        });

        if (existingThread) {
          resolvedThreadId = existingThread.id;

          // Unarchive thread if it was archived
          await prisma.messageThread.update({
            where: { id: existingThread.id },
            data: {
              isArchivedBuyer: false,
              isArchivedSeller: false,
            },
          });
        } else {
          // Create new thread
          const newThread = await prisma.messageThread.create({
            data: {
              listingId: listing.id,
              buyerId: userId,
              sellerId: listing.sellerId,
              lastMessageAt: new Date(),
            },
          });

          resolvedThreadId = newThread.id;
        }
      }

      // Create the message
      const message = await prisma.message.create({
        data: {
          threadId: resolvedThreadId,
          senderId: userId,
          body,
        },
        select: {
          id: true,
          threadId: true,
          senderId: true,
          body: true,
          isRead: true,
          createdAt: true,
          sender: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      // Update thread lastMessageAt
      await prisma.messageThread.update({
        where: { id: resolvedThreadId },
        data: { lastMessageAt: new Date() },
      });

      // Increment contact count on the listing
      const thread = await prisma.messageThread.findUnique({
        where: { id: resolvedThreadId },
        select: { listingId: true },
      });

      if (thread) {
        await prisma.listing.update({
          where: { id: thread.listingId },
          data: { contactCount: { increment: 1 } },
        });
      }

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/messages/:threadId/archive
   * Archive a thread for the current user.
   */
  async archiveThread(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { threadId } = req.params;

      const thread = await prisma.messageThread.findUnique({
        where: { id: threadId },
        select: { id: true, buyerId: true, sellerId: true },
      });

      if (!thread) {
        throw new AppError("Thread not found", 404);
      }

      if (thread.buyerId !== userId && thread.sellerId !== userId) {
        throw new AppError("You do not have access to this thread", 403);
      }

      const isBuyer = thread.buyerId === userId;

      await prisma.messageThread.update({
        where: { id: threadId },
        data: isBuyer
          ? { isArchivedBuyer: true }
          : { isArchivedSeller: true },
      });

      res.json({
        success: true,
        data: { archived: true },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/messages/unread
   * Return total unread message count for the user across all threads.
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      // Get all thread IDs where the user is buyer or seller
      const threads = await prisma.messageThread.findMany({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        select: { id: true },
      });

      const threadIds = threads.map((t) => t.id);

      const count = threadIds.length > 0
        ? await prisma.message.count({
            where: {
              threadId: { in: threadIds },
              senderId: { not: userId },
              isRead: false,
            },
          })
        : 0;

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  },
};
