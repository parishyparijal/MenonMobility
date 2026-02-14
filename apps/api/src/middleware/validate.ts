import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// ---------------------------------------------------------------------------
// Zod Validation Middleware
// ---------------------------------------------------------------------------

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Middleware factory that validates req.body, req.query, and/or req.params
 * against the provided Zod schemas.
 *
 * Usage:
 *   router.post(
 *     "/listings",
 *     validate({ body: createListingSchema }),
 *     handler
 *   );
 *
 *   router.get(
 *     "/listings",
 *     validate({ query: listingQuerySchema }),
 *     handler
 *   );
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Record<string, string>;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
          code: e.code,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
        return;
      }
      next(err);
    }
  };
}
