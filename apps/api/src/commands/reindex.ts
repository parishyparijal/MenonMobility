import { elasticsearchService } from "@/services/elasticsearch.service";

// ---------------------------------------------------------------------------
// CLI Command: Reindex all listings in Elasticsearch
// ---------------------------------------------------------------------------
// Run with:
//   npm run reindex              # incremental reindex
//   npm run reindex -- --fresh   # delete + recreate index, then reindex all
// ---------------------------------------------------------------------------

async function reindex(): Promise<void> {
  const args = process.argv.slice(2);
  const fresh = args.includes("--fresh");

  console.log(`[Reindex] Starting ${fresh ? "FRESH" : "incremental"} reindex...`);

  const count = await elasticsearchService.reindexAll(fresh);

  console.log(`[Reindex] Done! ${count} listings indexed.`);
  process.exit(0);
}

reindex().catch((err) => {
  console.error("[Reindex] Failed:", err);
  process.exit(1);
});
