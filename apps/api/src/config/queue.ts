import { Queue, Worker, type Processor, type WorkerOptions, type QueueOptions } from "bullmq";
import { redis } from "./redis";

// ---------------------------------------------------------------------------
// BullMQ Queue & Worker Factory
// ---------------------------------------------------------------------------
// All queues share the same Redis connection. Workers use a duplicate so they
// don't block the shared connection.
// ---------------------------------------------------------------------------

const defaultQueueOptions: Partial<QueueOptions> = {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
};

/**
 * Create a named BullMQ queue.
 */
export function createQueue(name: string, options?: Partial<QueueOptions>): Queue {
  return new Queue(name, {
    ...defaultQueueOptions,
    ...options,
  });
}

/**
 * Create a BullMQ worker for a given queue name.
 */
export function createWorker<T = unknown>(
  name: string,
  processor: Processor<T>,
  options?: Partial<WorkerOptions>
): Worker<T> {
  return new Worker<T>(name, processor, {
    connection: redis.duplicate(),
    concurrency: 5,
    ...options,
  });
}

// ---------------------------------------------------------------------------
// Pre-defined queues used throughout the application
// ---------------------------------------------------------------------------
export const emailQueue = createQueue("email");
export const imageQueue = createQueue("image-processing");
export const searchIndexQueue = createQueue("search-index");
export const notificationQueue = createQueue("notification");
export const listingQueue = createQueue("listing");
