import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { productService } from "../services/product.service.js";

const router = Router();

// --- Validation Schemas ---

const createProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Harga tidak valid"),
  costPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Harga pokok tidak valid")
    .optional(),
  categoryId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  collection: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNewSeason: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU wajib diisi"),
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
  priceOverride: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
});

// --- Routes ---

/**
 * GET /api/products
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await productService.list({
      category: req.query.category as string,
      search: req.query.search as string,
      status: req.query.status as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 12,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/products/:id
 */
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id as string);
    if (!product) {
      res.status(404).json({ error: "Produk tidak ditemukan." });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/products
 */
router.post(
  "/",
  requireAuth,
  requireRole("admin", "owner"),
  validate(createProductSchema),
  async (req, res, next) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/products/:id
 */
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  validate(updateProductSchema),
  async (req, res, next) => {
    try {
      const product = await productService.update(req.params.id as string, req.body);
      if (!product) {
        res.status(404).json({ error: "Produk tidak ditemukan." });
        return;
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/products/:id (soft-delete → archive)
 */
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      const product = await productService.archive(req.params.id as string);
      if (!product) {
        res.status(404).json({ error: "Produk tidak ditemukan." });
        return;
      }
      res.json({ message: "Produk diarsipkan.", product });
    } catch (err) {
      next(err);
    }
  }
);

// --- Variant Routes ---

/**
 * POST /api/products/:id/variants
 */
router.post(
  "/:id/variants",
  requireAuth,
  requireRole("admin", "owner"),
  validate(createVariantSchema),
  async (req, res, next) => {
    try {
      const variant = await productService.createVariant({
        productId: req.params.id as string,
        ...req.body,
      });
      res.status(201).json(variant);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/products/:id/variants/:variantId
 */
router.patch(
  "/:id/variants/:variantId",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      const variant = await productService.updateVariant(
        req.params.variantId as string,
        req.body
      );
      if (!variant) {
        res.status(404).json({ error: "Varian tidak ditemukan." });
        return;
      }
      res.json(variant);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/products/:id/variants/:variantId
 */
router.delete(
  "/:id/variants/:variantId",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      await productService.deleteVariant(req.params.variantId as string);
      res.json({ message: "Varian dihapus." });
    } catch (err) {
      next(err);
    }
  }
);

// --- Image Routes ---

/**
 * POST /api/products/:id/images
 */
router.post(
  "/:id/images",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      const image = await productService.addImage({
        productId: req.params.id as string,
        ...req.body,
      });
      res.status(201).json(image);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
