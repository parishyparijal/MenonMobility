import { listingQueue, emailQueue, searchIndexQueue } from "@/config/queue";

// ---------------------------------------------------------------------------
// Cron Scheduler Entry Point
// ---------------------------------------------------------------------------
// Run with: npm run scheduler (tsx src/scheduler.ts)
// Schedules periodic / repeatable jobs using BullMQ.
// ---------------------------------------------------------------------------

console.log("[Scheduler] Starting MenonTrucks job scheduler...");

async function registerScheduledJobs(): Promise<void> {
  // ------------------------------------------
  // Expire Listings — runs every hour
  // Finds listings past their expiration date and marks them expired.
  // ------------------------------------------
  await listingQueue.upsertJobScheduler(
    "expire-listings-scheduler",
    {
      pattern: "0 * * * *", // Every hour at minute 0
    },
    {
      name: "expire-listing",
      data: { type: "check-all-expired" },
    }
  );
  console.log("[Scheduler] Registered: expire-listings (every hour)");

  // ------------------------------------------
  // Send Listing Expiry Warnings — runs daily at 9 AM
  // Notifies sellers whose listings are about to expire.
  // ------------------------------------------
  await emailQueue.upsertJobScheduler(
    "expiry-warning-scheduler",
    {
      pattern: "0 9 * * *", // Daily at 9:00 AM
    },
    {
      name: "send-expiry-warnings",
      data: { type: "expiry-warning" },
    }
  );
  console.log("[Scheduler] Registered: expiry-warning emails (daily 9 AM)");

  // ------------------------------------------
  // Search Index Health Check — runs every 6 hours
  // Verifies Elasticsearch index integrity.
  // ------------------------------------------
  await searchIndexQueue.upsertJobScheduler(
    "search-health-check-scheduler",
    {
      pattern: "0 */6 * * *", // Every 6 hours
    },
    {
      name: "health-check",
      data: { type: "verify-index" },
    }
  );
  console.log("[Scheduler] Registered: search index health check (every 6h)");

  // ------------------------------------------
  // Send Weekly Digest — runs every Monday at 8 AM
  // Sends weekly digest emails to subscribed users.
  // ------------------------------------------
  await emailQueue.upsertJobScheduler(
    "weekly-digest-scheduler",
    {
      pattern: "0 8 * * 1", // Monday at 8:00 AM
    },
    {
      name: "send-weekly-digest",
      data: { type: "weekly-digest" },
    }
  );
  console.log("[Scheduler] Registered: weekly digest emails (Monday 8 AM)");

  // ------------------------------------------
  // Cleanup Old Notifications — runs daily at 3 AM
  // Removes notifications older than 90 days.
  // ------------------------------------------
  await listingQueue.upsertJobScheduler(
    "cleanup-notifications-scheduler",
    {
      pattern: "0 3 * * *", // Daily at 3:00 AM
    },
    {
      name: "cleanup-old-notifications",
      data: { type: "cleanup", maxAgeDays: 90 },
    }
  );
  console.log("[Scheduler] Registered: notification cleanup (daily 3 AM)");
}

// ---------------------------------------------------------------------------
// Initialize
// ---------------------------------------------------------------------------
registerScheduledJobs()
  .then(() => {
    console.log("[Scheduler] All scheduled jobs registered successfully.");
    console.log("[Scheduler] Scheduler is running. Press Ctrl+C to exit.");
  })
  .catch((err) => {
    console.error("[Scheduler] Failed to register scheduled jobs:", err);
    process.exit(1);
  });

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
function shutdown() {
  console.log("[Scheduler] Shutting down...");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
