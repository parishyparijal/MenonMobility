import Redis from "ioredis";

// ---------------------------------------------------------------------------
// Redis Client Singleton
// ---------------------------------------------------------------------------

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("[Redis] Connected successfully");
});

redis.on("error", (err) => {
  console.error("[Redis] Connection error:", err.message);
});

/**
 * Create a duplicate Redis connection (useful for BullMQ which needs separate
 * connections for the queue and the worker).
 */
export function createRedisConnection(): Redis {
  return new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

export default redis;
