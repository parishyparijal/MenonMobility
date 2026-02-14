import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";
import { ensureRole } from "@/middleware/roles";

// ---------------------------------------------------------------------------
// Admin Routes — /api/admin
// All routes require authentication + ADMIN role
// ---------------------------------------------------------------------------

const router = Router();

// Apply auth + admin role check to all admin routes
router.use(authenticate, ensureRole("ADMIN"));

// ---- Dashboard ----
router.get("/dashboard", (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: admin dashboard stats" });
});

// ---- User Management ----
router.get("/users", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list users" });
});

router.get("/users/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: get user "${req.params.id}"`,
  });
});

router.put("/users/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: update user "${req.params.id}"`,
  });
});

router.delete("/users/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete user "${req.params.id}"`,
  });
});

router.patch("/users/:id/ban", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: ban/unban user "${req.params.id}"`,
  });
});

// ---- Listing Management ----
router.get("/listings", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: admin list all listings" });
});

router.get("/listings/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: admin get listing "${req.params.id}"`,
  });
});

router.patch("/listings/:id/approve", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: approve listing "${req.params.id}"`,
  });
});

router.patch("/listings/:id/reject", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: reject listing "${req.params.id}"`,
  });
});

router.delete("/listings/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: admin delete listing "${req.params.id}"`,
  });
});

// ---- Category Management ----
router.post("/categories", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, data: null, message: "TODO: create category" });
});

router.put("/categories/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: update category "${req.params.id}"`,
  });
});

router.delete("/categories/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete category "${req.params.id}"`,
  });
});

// ---- Brand Management ----
router.post("/brands", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, data: null, message: "TODO: create brand" });
});

router.put("/brands/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: update brand "${req.params.id}"`,
  });
});

router.delete("/brands/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete brand "${req.params.id}"`,
  });
});

// ---- Subscription Management ----
router.get("/subscriptions", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: admin list subscriptions" });
});

// ---- Reports & Analytics ----
router.get("/reports", (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: admin reports" });
});

// ---- Page / CMS Management ----
router.get("/pages", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: admin list CMS pages" });
});

router.post("/pages", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, data: null, message: "TODO: create CMS page" });
});

router.put("/pages/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: null,
    message: `TODO: update CMS page "${req.params.id}"`,
  });
});

router.delete("/pages/:id", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: `TODO: delete CMS page "${req.params.id}"`,
  });
});

export default router;
