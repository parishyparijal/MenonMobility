import type { Job } from "bullmq";
import { createWorker } from "@/config/queue";

// ---------------------------------------------------------------------------
// BullMQ Worker Entry Point
// ---------------------------------------------------------------------------
// Run with: npm run worker (tsx src/worker.ts)
// Registers handlers for all job queues.
// ---------------------------------------------------------------------------

console.log("[Worker] Starting MenonTrucks job workers...");

// ---------------------------------------------------------------------------
// Email Worker
// ---------------------------------------------------------------------------
const emailWorker = createWorker("email", async (job: Job) => {
  console.log(`[Email Worker] Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case "send-welcome-email":
      // TODO: Implement welcome email
      console.log(`  -> Sending welcome email to ${job.data.email}`);
      break;

    case "send-password-reset":
      // TODO: Implement password reset email
      console.log(`  -> Sending password reset email to ${job.data.email}`);
      break;

    case "send-listing-approved":
      // TODO: Implement listing approved notification email
      console.log(`  -> Sending listing approved email to ${job.data.email}`);
      break;

    case "send-listing-rejected":
      // TODO: Implement listing rejected notification email
      console.log(`  -> Sending listing rejected email to ${job.data.email}`);
      break;

    case "send-contact-form":
      // TODO: Forward contact form submission to admin
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
    case "resize-listing-image":
      // TODO: Use sharp to resize images, create thumbnails, upload to S3
      console.log(`  -> Resizing image for listing ${job.data.listingId}`);
      break;

    case "delete-listing-images":
      // TODO: Remove images from S3
      console.log(`  -> Deleting images for listing ${job.data.listingId}`);
      break;

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
      // TODO: Index listing in Elasticsearch
      console.log(`  -> Indexing listing ${job.data.listingId}`);
      break;

    case "remove-listing":
      // TODO: Remove listing from Elasticsearch index
      console.log(`  -> Removing listing ${job.data.listingId} from index`);
      break;

    case "reindex-all":
      // TODO: Reindex all listings
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
    case "create-notification":
      // TODO: Create in-app notification record
      console.log(`  -> Creating notification for user ${job.data.userId}`);
      break;

    case "send-push-notification":
      // TODO: Send push notification
      console.log(`  -> Sending push notification to user ${job.data.userId}`);
      break;

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
    case "expire-listing":
      // TODO: Mark listing as expired in DB
      console.log(`  -> Expiring listing ${job.data.listingId}`);
      break;

    case "bump-listing":
      // TODO: Bump listing priority
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
