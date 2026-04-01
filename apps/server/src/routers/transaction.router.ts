import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { transactionService } from "../services/transaction.service.js";

const router = Router();

// --- Validation Schemas ---

const createTransactionSchema = z.object({
  invoiceNumber: z.string().min(1, "Nomor nota wajib diisi"),
  customerName: z.string().optional(),
  paymentMethod: z.enum(["cash", "credit_card", "debit_card", "qris", "transfer"]),
  paymentDetail: z.string().optional(),
  discount: z.string().optional(),
  tax: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid("Variant ID tidak valid"),
        quantity: z.number().int().min(1, "Minimal 1 item"),
      })
    )
    .min(1, "Minimal satu item diperlukan"),
});

// --- Routes ---

/**
 * GET /api/transactions
 * List transactions with filters and pagination.
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await transactionService.list({
      search: req.query.search as string,
      status: req.query.status as string,
      dateFrom: req.query.date_from as string,
      dateTo: req.query.date_to as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/transactions/volume
 * 24h transaction volume and success rate.
 */
router.get("/volume", requireAuth, async (_req, res, next) => {
  try {
    const data = await transactionService.getVolume();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/transactions/export
 * Export transactions for CSV download.
 */
router.get("/export", requireAuth, async (req, res, next) => {
  try {
    const data = await transactionService.exportData({
      dateFrom: req.query.date_from as string,
      dateTo: req.query.date_to as string,
    });

    // Generate CSV
    const headers = [
      "Invoice",
      "Tanggal",
      "Pelanggan",
      "Total",
      "Metode",
      "Status",
    ];
    const rows = data.map((t: { invoiceNumber: string; createdAt: Date; customerName: string | null; total: string; paymentMethod: string; status: string }) => [
      t.invoiceNumber,
      t.createdAt.toISOString(),
      t.customerName || "Anonim",
      t.total,
      t.paymentMethod,
      t.status,
    ]);

    const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv"
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/transactions/:id
 * Transaction detail with items.
 */
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const transaction = await transactionService.getById(req.params.id as string);
    if (!transaction) {
      res.status(404).json({ error: "Transaksi tidak ditemukan." });
      return;
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/transactions
 * Create a new transaction (POS sale).
 */
router.post(
  "/",
  requireAuth,
  validate(createTransactionSchema),
  async (req, res, next) => {
    try {
      const transaction = await transactionService.create({
        ...req.body,
        createdBy: req.user!.id,
      });
      res.status(201).json(transaction);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/transactions/:id/return
 * Process a return — restores stock.
 */
router.post(
  "/:id/return",
  requireAuth,
  requireRole("admin", "owner"),
  async (req, res, next) => {
    try {
      const result = await transactionService.processReturn(
        req.params.id as string,
        req.user!.id
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
