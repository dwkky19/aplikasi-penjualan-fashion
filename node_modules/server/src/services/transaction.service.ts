import { db } from "../db/index.js";
import {
  transactions,
  transactionItems,
  productVariants,
  products,
  inventoryLogs,
} from "../db/schema.js";
import { eq, and, gte, lte, ilike, desc, sql, or } from "drizzle-orm";

export const transactionService = {
  /**
   * List transactions with filters and pagination.
   */
  async list(params: {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (params.search) {
      conditions.push(
        or(
          ilike(transactions.invoiceNumber, `%${params.search}%`),
          ilike(transactions.customerName, `%${params.search}%`)
        )
      );
    }

    if (params.status) {
      conditions.push(
        eq(
          transactions.status,
          params.status as "completed" | "pending" | "returned" | "cancelled"
        )
      );
    }

    if (params.dateFrom) {
      conditions.push(gte(transactions.createdAt, new Date(params.dateFrom)));
    }

    if (params.dateTo) {
      conditions.push(lte(transactions.createdAt, new Date(params.dateTo)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db.query.transactions.findMany({
        where,
        with: {
          items: {
            with: {
              variant: {
                with: { product: { columns: { name: true } } },
              },
            },
          },
        },
        orderBy: [desc(transactions.createdAt)],
        limit,
        offset,
      }),
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(transactions)
        .where(where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: countResult[0]?.count || 0,
        totalPages: Math.ceil((countResult[0]?.count || 0) / limit),
      },
    };
  },

  /**
   * 24h volume and success rate.
   */
  async getVolume() {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await db
      .select({
        volume: sql<string>`COALESCE(SUM(${transactions.total}::numeric), 0)`,
        totalCount: sql<number>`COUNT(*)::int`,
        successCount: sql<number>`COUNT(*) FILTER (WHERE ${transactions.status} = 'completed')::int`,
      })
      .from(transactions)
      .where(gte(transactions.createdAt, last24h));

    const data = result[0];
    const successRate =
      data.totalCount > 0
        ? ((data.successCount / data.totalCount) * 100).toFixed(1)
        : "0";

    return {
      volume: data.volume,
      totalCount: data.totalCount,
      successCount: data.successCount,
      successRate: `${successRate}%`,
    };
  },

  /**
   * Get transaction detail by ID.
   */
  async getById(id: string) {
    return db.query.transactions.findFirst({
      where: eq(transactions.id, id),
      with: {
        items: {
          with: {
            variant: {
              with: { product: true },
            },
          },
        },
        createdByUser: { columns: { id: true, name: true } },
      },
    });
  },

  /**
   * Create a new transaction (POS sale).
   * Automatically deducts stock and creates inventory logs.
   */
  async create(data: {
    invoiceNumber: string;
    customerName?: string;
    paymentMethod: "cash" | "credit_card" | "debit_card" | "qris" | "transfer";
    paymentDetail?: string;
    discount?: string;
    tax?: string;
    notes?: string;
    items: Array<{ variantId: string; quantity: number }>;
    createdBy: string;
  }) {
    // Calculate totals by fetching variant prices
    let subtotal = 0;
    const itemsWithPrices = [];

    for (const item of data.items) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, item.variantId),
        with: { product: true },
      });

      if (!variant) throw new Error(`Variant ${item.variantId} not found`);
      if (variant.stock < item.quantity) {
        throw new Error(
          `Stok tidak cukup untuk ${variant.product.name} (SKU: ${variant.sku}). Tersedia: ${variant.stock}, diminta: ${item.quantity}`
        );
      }

      const unitPrice = parseFloat(
        variant.priceOverride || variant.product.basePrice
      );
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      itemsWithPrices.push({
        variantId: item.variantId,
        productName: variant.product.name,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice: unitPrice.toFixed(2),
        subtotal: itemSubtotal.toFixed(2),
        currentStock: variant.stock,
      });
    }

    const discount = parseFloat(data.discount || "0");
    const tax = parseFloat(data.tax || "0");
    const total = subtotal - discount + tax;

    // Create transaction
    const [transaction] = await db
      .insert(transactions)
      .values({
        invoiceNumber: data.invoiceNumber,
        customerName: data.customerName || "Anonim",
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: data.paymentMethod,
        paymentDetail: data.paymentDetail,
        notes: data.notes,
        createdBy: data.createdBy,
      })
      .returning();

    // Create transaction items + deduct stock + log
    for (const item of itemsWithPrices) {
      await db.insert(transactionItems).values({
        transactionId: transaction.id,
        variantId: item.variantId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      });

      const newStock = item.currentStock - item.quantity;

      // Deduct stock
      await db
        .update(productVariants)
        .set({ stock: newStock, updatedAt: new Date() })
        .where(eq(productVariants.id, item.variantId));

      // Inventory log
      await db.insert(inventoryLogs).values({
        variantId: item.variantId,
        type: "sale",
        quantityChange: -item.quantity,
        stockAfter: newStock,
        referenceId: transaction.id,
        notes: `Sale: ${transaction.invoiceNumber}`,
        createdBy: data.createdBy,
      });
    }

    return transaction;
  },

  /**
   * Process a return — restores stock.
   */
  async processReturn(transactionId: string, userId: string) {
    const tx = await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
      with: { items: true },
    });

    if (!tx) throw new Error("Transaction not found");
    if (tx.status === "returned")
      throw new Error("Transaction already returned");

    // Mark as returned
    await db
      .update(transactions)
      .set({ status: "returned", updatedAt: new Date() })
      .where(eq(transactions.id, transactionId));

    // Restore stock for each item
    for (const item of tx.items) {
      if (!item.variantId) continue;

      const [variant] = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, item.variantId));

      if (variant) {
        const newStock = variant.stock + item.quantity;

        await db
          .update(productVariants)
          .set({ stock: newStock, updatedAt: new Date() })
          .where(eq(productVariants.id, item.variantId));

        await db.insert(inventoryLogs).values({
          variantId: item.variantId,
          type: "return",
          quantityChange: item.quantity,
          stockAfter: newStock,
          referenceId: transactionId,
          notes: `Return: ${tx.invoiceNumber}`,
          createdBy: userId,
        });
      }
    }

    return { message: "Retur berhasil diproses", transactionId };
  },

  /**
   * Export transactions as structured data (for CSV generation).
   */
  async exportData(params: { dateFrom?: string; dateTo?: string }) {
    const conditions = [];
    if (params.dateFrom) {
      conditions.push(gte(transactions.createdAt, new Date(params.dateFrom)));
    }
    if (params.dateTo) {
      conditions.push(lte(transactions.createdAt, new Date(params.dateTo)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    return db.query.transactions.findMany({
      where,
      with: { items: true },
      orderBy: [desc(transactions.createdAt)],
    });
  },
};
