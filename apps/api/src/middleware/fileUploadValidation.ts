import { Request, Response, NextFunction } from "express";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// File Upload Validation Middleware
// ---------------------------------------------------------------------------
// Validates uploaded files by MIME type, extension, and size.
// ---------------------------------------------------------------------------

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validate uploaded image files.
 * Call after multer middleware.
 */
export function validateImageUploads(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const files = req.files as Express.Multer.File[] | undefined;
  const file = req.file;

  const filesToCheck = files || (file ? [file] : []);

  if (filesToCheck.length === 0) {
    next();
    return;
  }

  for (const f of filesToCheck) {
    // Check MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(f.mimetype)) {
      throw new AppError(
        `Invalid file type: ${f.mimetype}. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
        400
      );
    }

    // Check extension
    const ext = "." + f.originalname.split(".").pop()?.toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new AppError(
        `Invalid file extension: ${ext}. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}`,
        400
      );
    }

    // Check size
    if (f.size > MAX_FILE_SIZE) {
      throw new AppError(
        `File too large: ${(f.size / 1024 / 1024).toFixed(1)}MB. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        400
      );
    }
  }

  next();
}
