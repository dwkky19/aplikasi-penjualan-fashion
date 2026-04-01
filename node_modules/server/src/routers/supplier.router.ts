import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { supplierService } from "../services/supplier.service.js";

const router = Router();

const supplierSchema = z.object({
  name: z.string().min(1, "Nama pemasok wajib diisi"),
  contactEmail: z.string().email("Email tidak valid").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

/**
 * GET /api/suppliers
 */
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const data = await supplierService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/suppliers/:id
 */
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const supplier = await supplierService.getById(req.params.id as string);
    if (!supplier) {
      res.status(404).json({ error: "Pemasok tidak ditemukan." });
      return;
    }
    res.json(supplier);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/suppliers
 */
router.post(
  "/",
  requireAuth,
  requireRole("admin", "owner"),
  validate(supplierSchema),
  async (req, res, next) => {
    try {
      const supplier = await supplierService.create(req.body);
      res.status(201).json(supplier);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/suppliers/:id
 */
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  validate(supplierSchema.partial()),
  async (req, res, next) => {
    try {
      const supplier = await supplierService.update(req.params.id as string, req.body);
      if (!supplier) {
        res.status(404).json({ error: "Pemasok tidak ditemukan." });
        return;
      }
      res.json(supplier);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/suppliers/:id
 */
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      await supplierService.delete(req.params.id as string);
      res.json({ message: "Pemasok dihapus." });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
