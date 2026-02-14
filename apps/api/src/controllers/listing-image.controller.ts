import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// ---------------------------------------------------------------------------
// Listing Image Controller — upload, remove, reorder images
// ---------------------------------------------------------------------------

// Multer configuration: in-memory storage for processing before saving
const storage = multer.memoryStorage();

export const imageUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Max 10 files per request
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only JPEG, PNG, WebP, and AVIF images are allowed", 400) as any);
    }
  },
});

// Ensure upload directories exist
const UPLOAD_BASE = path.resolve(process.cwd(), "uploads", "listings");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Process an uploaded image buffer into thumbnail, medium, and large sizes.
 * Saves to disk and returns URLs.
 */
async function processImage(
  buffer: Buffer,
  listingId: string,
  originalName: string
): Promise<{
  originalUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  fileSize: number;
  width: number;
  height: number;
}> {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const baseName = `${uuidv4()}`;
  const listingDir = path.join(UPLOAD_BASE, listingId);
  ensureDir(listingDir);

  // Get original image metadata
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Save original
  const originalFileName = `${baseName}-original${ext}`;
  const originalPath = path.join(listingDir, originalFileName);
  await sharp(buffer).toFile(originalPath);

  // Generate thumbnail (150x150, cover)
  const thumbFileName = `${baseName}-thumb.webp`;
  const thumbPath = path.join(listingDir, thumbFileName);
  await sharp(buffer)
    .resize(150, 150, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  // Generate medium (600x450, fit inside)
  const mediumFileName = `${baseName}-medium.webp`;
  const mediumPath = path.join(listingDir, mediumFileName);
  await sharp(buffer)
    .resize(600, 450, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(mediumPath);

  // Generate large (1200x900, fit inside)
  const largeFileName = `${baseName}-large.webp`;
  const largePath = path.join(listingDir, largeFileName);
  await sharp(buffer)
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(largePath);

  // URL prefix (relative — to be served as static files or via CDN later)
  const urlPrefix = `/uploads/listings/${listingId}`;

  return {
    originalUrl: `${urlPrefix}/${originalFileName}`,
    thumbnailUrl: `${urlPrefix}/${thumbFileName}`,
    mediumUrl: `${urlPrefix}/${mediumFileName}`,
    largeUrl: `${urlPrefix}/${largeFileName}`,
    fileSize: buffer.length,
    width,
    height,
  };
}

export const listingImageController = {
  /**
   * POST /api/seller/listings/:id/images
   * Upload images for a listing. Max 20 images per listing total.
   */
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: listingId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new AppError("No images provided", 400);
      }

      // Verify listing exists and ownership
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, sellerId: true, imageCount: true, deletedAt: true },
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (listing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to upload images to this listing", 403);
      }

      // Check total image limit (20)
      const totalAfterUpload = listing.imageCount + files.length;
      if (totalAfterUpload > 20) {
        throw new AppError(
          `Cannot upload ${files.length} image(s). Listing already has ${listing.imageCount} image(s) and the maximum is 20.`,
          400
        );
      }

      // Get the current highest position
      const lastImage = await prisma.listingImage.findFirst({
        where: { listingId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      let nextPosition = (lastImage?.position ?? -1) + 1;

      // Process and save each image
      const createdImages = [];
      for (const file of files) {
        const processed = await processImage(file.buffer, listingId, file.originalname);

        const image = await prisma.listingImage.create({
          data: {
            listingId,
            position: nextPosition++,
            originalUrl: processed.originalUrl,
            thumbnailUrl: processed.thumbnailUrl,
            mediumUrl: processed.mediumUrl,
            largeUrl: processed.largeUrl,
            fileSize: processed.fileSize,
            width: processed.width,
            height: processed.height,
            altText: file.originalname.replace(/\.[^.]+$/, ""),
          },
        });

        createdImages.push(image);
      }

      // Update listing image count
      await prisma.listing.update({
        where: { id: listingId },
        data: { imageCount: { increment: files.length } },
      });

      res.status(201).json({
        success: true,
        data: createdImages,
        message: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/seller/listings/:id/images/:imageId
   * Delete an image record and its files. Update imageCount.
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: listingId, imageId } = req.params;

      // Verify listing ownership
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, sellerId: true, deletedAt: true },
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (listing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to delete images from this listing", 403);
      }

      // Find the image
      const image = await prisma.listingImage.findUnique({
        where: { id: imageId },
      });

      if (!image || image.listingId !== listingId) {
        throw new AppError("Image not found", 404);
      }

      // Delete image files from disk
      const urlsToDelete = [
        image.originalUrl,
        image.thumbnailUrl,
        image.mediumUrl,
        image.largeUrl,
        image.webpUrl,
      ].filter(Boolean);

      for (const url of urlsToDelete) {
        if (url) {
          const filePath = path.resolve(process.cwd(), url.replace(/^\//, ""));
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch {
            // Silently ignore file deletion errors — DB record is more important
          }
        }
      }

      // Delete the database record
      await prisma.listingImage.delete({
        where: { id: imageId },
      });

      // Update listing image count
      await prisma.listing.update({
        where: { id: listingId },
        data: { imageCount: { decrement: 1 } },
      });

      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/seller/listings/:id/images/reorder
   * Update positions of images. Accepts array of { imageId, position }.
   */
  async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: listingId } = req.params;
      const { images } = req.body as { images: Array<{ imageId: string; position: number }> };

      // Verify listing ownership
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, sellerId: true, deletedAt: true },
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (listing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to reorder images for this listing", 403);
      }

      // Verify all images belong to this listing
      const imageIds = images.map((img) => img.imageId);
      const existingImages = await prisma.listingImage.findMany({
        where: {
          id: { in: imageIds },
          listingId,
        },
        select: { id: true },
      });

      if (existingImages.length !== imageIds.length) {
        throw new AppError("One or more image IDs are invalid or do not belong to this listing", 400);
      }

      // Update positions in a transaction
      await prisma.$transaction(
        images.map((img) =>
          prisma.listingImage.update({
            where: { id: img.imageId },
            data: { position: img.position },
          })
        )
      );

      // Fetch updated images in order
      const updatedImages = await prisma.listingImage.findMany({
        where: { listingId },
        orderBy: { position: "asc" },
      });

      res.json({
        success: true,
        data: updatedImages,
        message: "Image order updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
