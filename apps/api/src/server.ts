import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "@/middleware/errorHandler";
import { generalLimiter } from "@/middleware/rateLimiter";
import { router } from "@/routes";

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
// Global middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(generalLimiter);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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
