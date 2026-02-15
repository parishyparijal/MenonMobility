import { Router } from "express";
import { sitemapController } from "@/controllers/sitemap.controller";

// ---------------------------------------------------------------------------
// Sitemap Routes — /api/sitemap (public, cached)
// ---------------------------------------------------------------------------

const router = Router();

router.get("/listings", sitemapController.listings);
router.get("/categories", sitemapController.categories);
router.get("/sellers", sitemapController.sellers);

export default router;
