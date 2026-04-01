import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { categoryService } from "../services/category.service.js";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
});

/**
 * GET /api/categories
 */
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const data = await categoryService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/categories
 */
router.post(
  "/",
  requireAuth,
  requireRole("admin", "owner"),
  validate(categorySchema),
  async (req, res, next) => {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/categories/:id
 */
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  validate(categorySchema.partial()),
  async (req, res, next) => {
    try {
      const category = await categoryService.update(req.params.id as string, req.body);
      if (!category) {
        res.status(404).json({ error: "Kategori tidak ditemukan." });
        return;
      }
      res.json(category);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/categories/:id
 */
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      await categoryService.delete(req.params.id as string);
      res.json({ message: "Kategori dihapus." });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
