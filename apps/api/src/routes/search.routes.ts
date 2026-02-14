import { Router } from "express";
import { searchController } from "@/controllers/search.controller";
import { validate } from "@/middleware/validate";
import { searchQuerySchema, suggestionsQuerySchema } from "@/validators/search.validator";

// ---------------------------------------------------------------------------
// Search Routes — /api/search
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/search — Full-text search across listings
router.get(
  "/",
  validate({ query: searchQuerySchema }),
  searchController.search
);

// GET /api/search/suggestions — Autocomplete / typeahead suggestions
router.get(
  "/suggestions",
  validate({ query: suggestionsQuerySchema }),
  searchController.suggestions
);

export default router;
