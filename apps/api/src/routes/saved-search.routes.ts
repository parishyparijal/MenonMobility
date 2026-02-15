import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { savedSearchController } from "@/controllers/saved-search.controller";
import {
  createSavedSearchBodySchema,
  updateSavedSearchBodySchema,
  savedSearchIdParamsSchema,
  listSavedSearchesQuerySchema,
} from "@/validators/saved-search.validator";

// ---------------------------------------------------------------------------
// Saved Search Routes — /api/saved-searches
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/saved-searches
router.get(
  "/",
  validate({ query: listSavedSearchesQuerySchema }),
  savedSearchController.list
);

// POST /api/saved-searches
router.post(
  "/",
  validate({ body: createSavedSearchBodySchema }),
  savedSearchController.create
);

// PUT /api/saved-searches/:id
router.put(
  "/:id",
  validate({ params: savedSearchIdParamsSchema, body: updateSavedSearchBodySchema }),
  savedSearchController.update
);

// DELETE /api/saved-searches/:id
router.delete(
  "/:id",
  validate({ params: savedSearchIdParamsSchema }),
  savedSearchController.remove
);

export default router;
