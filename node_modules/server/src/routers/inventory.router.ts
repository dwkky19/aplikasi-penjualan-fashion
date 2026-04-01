import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { inventoryService } from "../services/inventory.service.js";

const router = Router();

// --- Validation Schemas ---

const adjustStockSchema = z.object({
  newStock: z.number().int().min(0, "Stok tidak boleh negatif"),
  notes: z.string().min(1, "Catatan wajib diisi"),
});

const createPOSchema = z.object({
  orderNumber: z.string().min(1, "Nomor PO wajib diisi"),
  supplierId: z.string().uuid("Supplier ID tidak valid"),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1),
        unitCost: z.string().regex(/^\d+(\.\d{1,2})?$/),
      })
    )
    .min(1, "Minimal satu item diperlukan"),
});

// --- Routes ---

/**
 * GET /api/inventory
 * List variants with stock health.
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await inventoryService.list({
      category: req.query.category as string,
      stockStatus: req.query.status as "out_of_stock" | "low" | "safe",
      search: req.query.search as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/inventory/stats
 * Inventory KPIs.
 */
router.get("/stats", requireAuth, async (_req, res, next) => {
  try {
    const stats = await inventoryService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/inventory/:variantId/adjust
 * Manual stock adjustment (stock opname).
 */
router.patch(
  "/:variantId/adjust",
  requireAuth,
  requireRole("admin", "owner"),
  validate(adjustStockSchema),
  async (req, res, next) => {
    try {
      const result = await inventoryService.adjustStock(
        req.params.variantId as string,
        req.body.newStock,
        req.body.notes,
        req.user!.id
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/inventory/logs
 * Stock change audit trail.
 */
router.get("/logs", requireAuth, async (req, res, next) => {
  try {
    const data = await inventoryService.getLogs({
      variantId: req.query.variant_id as string,
      type: req.query.type as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/inventory/shipments
 * Incoming purchase orders.
 */
router.get("/shipments", requireAuth, async (_req, res, next) => {
  try {
    const data = await inventoryService.getShipments();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/inventory/purchase-orders
 * Create a purchase order (restock request).
 */
router.post(
  "/purchase-orders",
  requireAuth,
  requireRole("admin", "owner"),
  validate(createPOSchema),
  async (req, res, next) => {
    try {
      const po = await inventoryService.createPurchaseOrder({
        ...req.body,
        createdBy: req.user!.id,
      });
      res.status(201).json(po);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/inventory/purchase-orders/:id
 * Update PO status (auto-restock on delivered).
 */
router.patch(
  "/purchase-orders/:id",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const po = await inventoryService.updatePurchaseOrderStatus(
        req.params.id as string,
        status,
        req.user!.id
      );
      res.json(po);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
