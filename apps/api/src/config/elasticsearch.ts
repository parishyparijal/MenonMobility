import { Client } from "@elastic/elasticsearch";

// ---------------------------------------------------------------------------
// Elasticsearch Client Singleton
// ---------------------------------------------------------------------------

const ELASTICSEARCH_URL =
  process.env.ELASTICSEARCH_URL || "http://localhost:9200";

export const esClient = new Client({
  node: ELASTICSEARCH_URL,
  auth:
    process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
      ? {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        }
      : undefined,
  tls:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false },
});

/**
 * Verify the Elasticsearch connection. Call during startup if needed.
 */
export async function pingElasticsearch(): Promise<boolean> {
  try {
    const result = await esClient.ping();
    console.log("[Elasticsearch] Connected successfully");
    return !!result;
  } catch (err) {
    console.error("[Elasticsearch] Connection failed:", err);
    return false;
  }
}

export default esClient;
