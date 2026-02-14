import { Router } from "express";

import authRoutes from "./auth.routes";
import listingRoutes from "./listing.routes";
import searchRoutes from "./search.routes";
import categoryRoutes from "./category.routes";
import brandRoutes from "./brand.routes";
import sellerRoutes from "./seller.routes";
import adminRoutes from "./admin.routes";
import favoriteRoutes from "./favorite.routes";
import messageRoutes from "./message.routes";
import notificationRoutes from "./notification.routes";
import subscriptionRoutes from "./subscription.routes";
import contactRoutes from "./contact.routes";
import pageRoutes from "./page.routes";

// ---------------------------------------------------------------------------
// Main API Router
// ---------------------------------------------------------------------------

export const router = Router();

router.use("/auth", authRoutes);
router.use("/listings", listingRoutes);
router.use("/search", searchRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/contact", contactRoutes);
router.use("/pages", pageRoutes);

export default router;
