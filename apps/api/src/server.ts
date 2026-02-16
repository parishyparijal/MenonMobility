import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "@/middleware/errorHandler";
import { generalLimiter } from "@/middleware/rateLimiter";
import { sanitizeInput } from "@/middleware/sanitize";
import { requestId } from "@/middleware/requestId";
import { requestLogger } from "@/middleware/requestLogger";
import { router } from "@/routes";
import { stripeWebhookHandler } from "@/controllers/stripe-webhook.controller";
import prisma from "@/config/database";
import { redis } from "@/config/redis";

// ---------------------------------------------------------------------------
// Load environment variables (dotenv can be added if needed)
// ---------------------------------------------------------------------------
const PORT = process.env.API_PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// ---------------------------------------------------------------------------
// Create Express application
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Trust reverse proxy (Nginx) — required for rate limiting behind proxy
// ---------------------------------------------------------------------------
app.set("trust proxy", 1);

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(requestId);
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(requestLogger);
app.use(cookieParser());

// Stripe webhook needs raw body — mount BEFORE express.json()
app.post(
  "/api/stripe/webhooks",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(sanitizeInput);
app.use(generalLimiter);

// ---------------------------------------------------------------------------
// Health check (enhanced)
// ---------------------------------------------------------------------------
app.get("/health", async (_req, res) => {
  const checks: Record<string, string> = {};

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  // Redis check
  try {
    await redis.ping();
    checks.redis = "ok";
  } catch {
    checks.redis = "error";
  }

  // Memory usage
  const mem = process.memoryUsage();
  const memoryMB = Math.round(mem.heapUsed / 1024 / 1024);

  const allOk = Object.values(checks).every((v) => v === "ok");

  res.status(allOk ? 200 : 503).json({
    status: allOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    memoryMB,
    checks,
  });
});

// ---------------------------------------------------------------------------
// Mount API routes
// ---------------------------------------------------------------------------
app.use("/api", router);

// ---------------------------------------------------------------------------
// Global error handler (must be last)
// ---------------------------------------------------------------------------
app.use(globalErrorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[MenonTrucks API] Server running on port ${PORT}`);
  console.log(`[MenonTrucks API] Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
