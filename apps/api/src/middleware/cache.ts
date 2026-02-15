import { Request, Response, NextFunction } from "express";
import { redis } from "@/config/redis";

// ---------------------------------------------------------------------------
// Redis API Cache Middleware
// ---------------------------------------------------------------------------
// Caches GET responses in Redis with configurable TTL.
// Cache key is derived from the full URL (path + query string).
// ---------------------------------------------------------------------------

const CACHE_PREFIX = "api-cache:";

/**
 * Create a caching middleware with the given TTL (in seconds).
 * Only caches successful (2xx) JSON responses for GET requests.
 */
export function cache(ttlSeconds: number = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      next();
      return;
    }

    const cacheKey = `${CACHE_PREFIX}${req.originalUrl}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        res.set("X-Cache", "HIT");
        res.set("Content-Type", "application/json");
        res.send(cached);
        return;
      }
    } catch {
      // Redis down — proceed without cache
    }

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const serialized = JSON.stringify(body);
        redis
          .setex(cacheKey, ttlSeconds, serialized)
          .catch(() => { /* ignore cache write errors */ });
      }
      res.set("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
}

/**
 * Invalidate cache entries matching a pattern.
 * Use after mutations to clear stale cache.
 * Example: invalidateCache("/api/listings*") clears all listing caches.
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(`${CACHE_PREFIX}${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Ignore cache invalidation errors
  }
}

/**
 * Middleware that invalidates cache patterns after a successful mutation.
 * Attach to POST/PUT/DELETE routes.
 */
export function invalidateCacheAfter(...patterns: string[]) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    // Hook into response finish to invalidate after successful response
    res.on("finish", async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        for (const pattern of patterns) {
          await invalidateCache(pattern);
        }
      }
    });
    next();
  };
}
