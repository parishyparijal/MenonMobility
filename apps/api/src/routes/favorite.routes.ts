import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { favoriteController } from "@/controllers/favorite.controller";
import {
  toggleFavoriteBodySchema,
  listFavoritesQuerySchema,
  checkFavoritesQuerySchema,
} from "@/validators/favorite.validator";

// ---------------------------------------------------------------------------
// Favorite Routes — /api/favorites
// All routes require authentication
// ---------------------------------------------------------------------------

const router = Router();

router.use(authenticate);

// GET /api/favorites — Get current user's favorite listings
router.get(
  "/",
  validate({ query: listFavoritesQuerySchema }),
  favoriteController.list
);

// GET /api/favorites/check?listingIds=id1,id2,id3 — Check which listings are favorited
router.get(
  "/check",
  validate({ query: checkFavoritesQuerySchema }),
  favoriteController.check
);

// POST /api/favorites — Toggle a listing as favorite
router.post(
  "/",
  validate({ body: toggleFavoriteBodySchema }),
  favoriteController.toggle
);

export default router;
