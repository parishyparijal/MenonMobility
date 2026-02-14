import type { Job } from "bullmq";
import { createWorker } from "@/config/queue";
import prisma from "@/config/database";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { s3Client, S3_BUCKET } from "@/config/s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// BullMQ Worker Entry Point
// ---------------------------------------------------------------------------
// Run with: npm run worker (tsx src/worker.ts)
// Registers handlers for all job queues.
// ---------------------------------------------------------------------------

console.log("[Worker] Starting MenonTrucks job workers...");

const UPLOAD_BASE = path.resolve(process.cwd(), "uploads", "listings");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function uploadToS3(filePath: string, key: string, contentType: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );
  const endpoint = process.env.S3_ENDPOINT || `https://${S3_BUCKET}.s3.amazonaws.com`;
  return `${endpoint}/${S3_BUCKET}/${key}`;
}

async function deleteFromS3(key: string): Promise<void> {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      })
    );
  } catch {
    // Silently ignore S3 delete errors
  }
}

// ---------------------------------------------------------------------------
// Email Worker
// ---------------------------------------------------------------------------
const emailWorker = createWorker("email", async (job: Job) => {
  console.log(`[Email Worker] Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case "send-welcome-email":
      console.log(`  -> Sending welcome email to ${job.data.email}`);
      break;

    case "send-password-reset":
      console.log(`  -> Sending password reset email to ${job.data.email}`);
      break;

    case "send-listing-approved":
      console.log(`  -> Sending listing approved email to ${job.data.email}`);
      break;

    case "send-listing-rejected":
      console.log(`  -> Sending listing rejected email to ${job.data.email}`);
      break;

    case "send-contact-form":
      console.log(`  -> Forwarding contact form from ${job.data.email}`);
      break;

    default:
      console.log(`  -> Unknown email job: ${job.name}`);
  }
});

emailWorker.on("completed", (job) => {
  console.log(`[Email Worker] Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`[Email Worker] Job ${job?.id} failed:`, err.message);
});

// ---------------------------------------------------------------------------
// Image Processing Worker
// ---------------------------------------------------------------------------
const imageWorker = createWorker("image-processing", async (job: Job) => {
  console.log(`[Image Worker] Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case "process-listing-images": {
      const { listingId, imageId, filePath, originalName } = job.data;
      console.log(`  -> Processing image for listing ${listingId}`);

      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(originalName).toLowerCase() || ".jpg";
      const baseName = imageId;
      const listingDir = path.join(UPLOAD_BASE, listingId);
      ensureDir(listingDir);

      const metadata = await sharp(buffer).metadata();

      // Original (max 2400px width)
      const originalPath = path.join(listingDir, `${baseName}-original${ext}`);
      await sharp(buffer)
        .resize(2400, undefined, { fit: "inside", withoutEnlargement: true })
        .toFile(originalPath);

      // Thumbnail (300x225, cover crop, WebP)
      const thumbPath = path.join(listingDir, `${baseName}-thumb.webp`);
      await sharp(buffer)
        .resize(300, 225, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      // Medium (600px width, WebP)
      const mediumPath = path.join(listingDir, `${baseName}-medium.webp`);
      await sharp(buffer)
        .resize(600, undefined, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mediumPath);

      // Large (1200px width, WebP)
      const largePath = path.join(listingDir, `${baseName}-large.webp`);
      await sharp(buffer)
        .resize(1200, undefined, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(largePath);

      // WebP version of original
      const webpPath = path.join(listingDir, `${baseName}-original.webp`);
      await sharp(buffer)
        .resize(2400, undefined, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(webpPath);

      // Try S3 upload if configured, otherwise use local paths
      const useS3 = !!process.env.S3_ENDPOINT || !!process.env.S3_ACCESS_KEY_ID;
      let urls: Record<string, string>;

      if (useS3) {
        const s3Prefix = `listings/${listingId}`;
        const [originalUrl, thumbUrl, mediumUrl, largeUrl, webpUrl] = await Promise.all([
          uploadToS3(originalPath, `${s3Prefix}/${baseName}-original${ext}`, `image/${ext.slice(1)}`),
          uploadToS3(thumbPath, `${s3Prefix}/${baseName}-thumb.webp`, "image/webp"),
          uploadToS3(mediumPath, `${s3Prefix}/${baseName}-medium.webp`, "image/webp"),
          uploadToS3(largePath, `${s3Prefix}/${baseName}-large.webp`, "image/webp"),
          uploadToS3(webpPath, `${s3Prefix}/${baseName}-original.webp`, "image/webp"),
        ]);
        urls = { originalUrl, thumbnailUrl: thumbUrl, mediumUrl, largeUrl, webpUrl };
      } else {
        const prefix = `/uploads/listings/${listingId}`;
        urls = {
          originalUrl: `${prefix}/${baseName}-original${ext}`,
          thumbnailUrl: `${prefix}/${baseName}-thumb.webp`,
          mediumUrl: `${prefix}/${baseName}-medium.webp`,
          largeUrl: `${prefix}/${baseName}-large.webp`,
          webpUrl: `${prefix}/${baseName}-original.webp`,
        };
      }

      // Update database record
      await prisma.listingImage.update({
        where: { id: imageId },
        data: {
          originalUrl: urls.originalUrl,
          thumbnailUrl: urls.thumbnailUrl,
          mediumUrl: urls.mediumUrl,
          largeUrl: urls.largeUrl,
          webpUrl: urls.webpUrl,
          width: metadata.width || 0,
          height: metadata.height || 0,
          fileSize: buffer.length,
        },
      });

      // Clean up temp file
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch { /* ignore */ }

      console.log(`  -> Image ${imageId} processed successfully`);
      break;
    }

    case "delete-listing-images": {
      const { listingId: delListingId, imageUrls } = job.data;
      console.log(`  -> Deleting images for listing ${delListingId}`);

      for (const url of imageUrls || []) {
        if (url?.startsWith("/uploads/")) {
          const filePath = path.resolve(process.cwd(), url.replace(/^\//, ""));
          try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch { /* ignore */ }
        } else if (url) {
          const key = url.replace(/^https?:\/\/[^/]+\/[^/]+\//, "");
          await deleteFromS3(key);
        }
      }
      break;
    }

    default:
      console.log(`  -> Unknown image job: ${job.name}`);
  }
});

imageWorker.on("completed", (job) => {
  console.log(`[Image Worker] Job ${job.id} completed`);
});

imageWorker.on("failed", (job, err) => {
  console.error(`[Image Worker] Job ${job?.id} failed:`, err.message);
});

// ---------------------------------------------------------------------------
// Search Index Worker
// ---------------------------------------------------------------------------
const searchIndexWorker = createWorker("search-index", async (job: Job) => {
  console.log(`[Search Index Worker] Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case "index-listing":
      console.log(`  -> Indexing listing ${job.data.listingId}`);
      break;

    case "remove-listing":
      console.log(`  -> Removing listing ${job.data.listingId} from index`);
      break;

    case "reindex-all":
      console.log(`  -> Full reindex started`);
      break;

    default:
      console.log(`  -> Unknown search index job: ${job.name}`);
  }
});

searchIndexWorker.on("completed", (job) => {
  console.log(`[Search Index Worker] Job ${job.id} completed`);
});

searchIndexWorker.on("failed", (job, err) => {
  console.error(`[Search Index Worker] Job ${job?.id} failed:`, err.message);
});

// ---------------------------------------------------------------------------
// Notification Worker
// ---------------------------------------------------------------------------
const notificationWorker = createWorker("notification", async (job: Job) => {
  console.log(`[Notification Worker] Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case "create-notification": {
      const { userId, type, title, body } = job.data;
      await prisma.notification.create({
        data: { userId, type, title, body, isRead: false },
      });
      console.log(`  -> Created notification for user ${userId}`);
      break;
    }

    default:
      console.log(`  -> Unknown notification job: ${job.name}`);
  }
});

notificationWorker.on("completed", (job) => {
  console.log(`[Notification Worker] Job ${job.id} completed`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`[Notification Worker] Job ${job?.id} failed:`, err.message);
});

// ---------------------------------------------------------------------------
// Listing Worker
// ---------------------------------------------------------------------------
const listingWorker = createWorker("listing", async (job: Job) => {
  console.log(`[Listing Worker] Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case "expire-listing": {
      const { listingId } = job.data;
      await prisma.listing.update({
        where: { id: listingId },
        data: { status: "EXPIRED" },
      });
      console.log(`  -> Expired listing ${listingId}`);
      break;
    }

    case "bump-listing":
      console.log(`  -> Bumping listing ${job.data.listingId}`);
      break;

    default:
      console.log(`  -> Unknown listing job: ${job.name}`);
  }
});

listingWorker.on("completed", (job) => {
  console.log(`[Listing Worker] Job ${job.id} completed`);
});

listingWorker.on("failed", (job, err) => {
  console.error(`[Listing Worker] Job ${job?.id} failed:`, err.message);
});

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
async function shutdown() {
  console.log("[Worker] Shutting down gracefully...");
  await Promise.all([
    emailWorker.close(),
    imageWorker.close(),
    searchIndexWorker.close(),
    notificationWorker.close(),
    listingWorker.close(),
  ]);
  console.log("[Worker] All workers shut down.");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log("[Worker] All workers are running. Waiting for jobs...");
