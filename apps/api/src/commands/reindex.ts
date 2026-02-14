import { searchIndexQueue } from "@/config/queue";

// ---------------------------------------------------------------------------
// CLI Command: Reindex all listings in Elasticsearch
// ---------------------------------------------------------------------------
// Run with: npm run reindex (tsx src/commands/reindex.ts)
// ---------------------------------------------------------------------------

async function reindex(): Promise<void> {
  console.log("[Reindex] Dispatching full reindex job...");

  await searchIndexQueue.add("reindex-all", {
    type: "full-reindex",
    timestamp: new Date().toISOString(),
  });

  console.log("[Reindex] Reindex job added to queue successfully.");
  console.log("[Reindex] The worker process will pick it up and execute it.");
  process.exit(0);
}

reindex().catch((err) => {
  console.error("[Reindex] Failed:", err);
  process.exit(1);
});
