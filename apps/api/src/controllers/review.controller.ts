import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Seller Review Controller
// ---------------------------------------------------------------------------

export const reviewController = {
  /**
   * POST /api/sellers/:slug/reviews
   * Create a review for a seller.
   * Only buyers who have had a message thread with the seller can review.
   * One review per buyer per seller.
   * Rating 1-5. Updates seller profile rating average and review count.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { slug } = req.params;
      const { rating, title, body, listingId } = req.body;

      // Find seller profile
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { slug },
        select: { id: true, userId: true, rating: true, reviewCount: true },
      });

      if (!sellerProfile) {
        throw new AppError("Seller profile not found", 404);
      }

      // Can't review yourself
      if (sellerProfile.userId === userId) {
        throw new AppError("You cannot review your own profile", 400);
      }

      // Check if buyer has had a message thread with this seller
      const hasThread = await prisma.messageThread.findFirst({
        where: {
          buyerId: userId,
          sellerId: sellerProfile.userId,
        },
        select: { id: true },
      });

      if (!hasThread) {
        throw new AppError(
          "You can only review sellers you have communicated with",
          403
        );
      }

      // Check if buyer already reviewed this seller
      const existingReview = await prisma.sellerReview.findFirst({
        where: {
          buyerId: userId,
          sellerId: sellerProfile.id,
        },
        select: { id: true },
      });

      if (existingReview) {
        throw new AppError("You have already reviewed this seller", 409);
      }

      // Validate listingId if provided
      if (listingId) {
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
          select: { id: true, sellerId: true },
        });

        if (!listing || listing.sellerId !== sellerProfile.userId) {
          throw new AppError("Invalid listing for this seller", 400);
        }
      }

      // Create the review
      const review = await prisma.sellerReview.create({
        data: {
          buyerId: userId,
          sellerId: sellerProfile.id,
          listingId: listingId || null,
          rating,
          title: title || null,
          body,
          isVerifiedPurchase: true, // They have a message thread
        },
        select: {
          id: true,
          rating: true,
          title: true,
          body: true,
          isVerifiedPurchase: true,
          createdAt: true,
          buyer: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      // Update seller profile rating and review count
      const newReviewCount = sellerProfile.reviewCount + 1;
      const newRating =
        (sellerProfile.rating * sellerProfile.reviewCount + rating) / newReviewCount;

      await prisma.sellerProfile.update({
        where: { id: sellerProfile.id },
        data: {
          rating: Math.round(newRating * 100) / 100, // Round to 2 decimal places
          reviewCount: newReviewCount,
        },
      });

      res.status(201).json({
        success: true,
        data: review,
        message: "Review created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/sellers/:slug/reviews/:reviewId/respond
   * Seller responds to a review on their profile.
   */
  async respond(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { slug, reviewId } = req.params;
      const { response } = req.body;

      // Find seller profile and verify ownership
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { slug },
        select: { id: true, userId: true },
      });

      if (!sellerProfile) {
        throw new AppError("Seller profile not found", 404);
      }

      if (sellerProfile.userId !== userId) {
        throw new AppError("You can only respond to reviews on your own profile", 403);
      }

      // Find the review
      const review = await prisma.sellerReview.findUnique({
        where: { id: reviewId },
        select: { id: true, sellerId: true, sellerResponse: true },
      });

      if (!review) {
        throw new AppError("Review not found", 404);
      }

      if (review.sellerId !== sellerProfile.id) {
        throw new AppError("This review does not belong to your profile", 403);
      }

      if (review.sellerResponse) {
        throw new AppError("You have already responded to this review", 409);
      }

      // Update the review with the seller's response
      const updated = await prisma.sellerReview.update({
        where: { id: reviewId },
        data: {
          sellerResponse: response,
          respondedAt: new Date(),
        },
        select: {
          id: true,
          rating: true,
          title: true,
          body: true,
          isVerifiedPurchase: true,
          sellerResponse: true,
          respondedAt: true,
          createdAt: true,
          buyer: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Response added successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
