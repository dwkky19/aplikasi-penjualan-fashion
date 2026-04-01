import { db } from "../db/index.js";
import {
  productVariants,
  products,
  inventoryLogs,
  purchaseOrders,
  purchaseOrderItems,
} from "../db/schema.js";
import { eq, sql, and, desc, or } from "drizzle-orm";

export const inventoryService = {
  /**
   * List all variants with stock health, filterable.
   */
  async list(params: {
    category?: string;
    stockStatus?: "out_of_stock" | "low" | "safe";
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let stockCondition;
    if (params.stockStatus === "out_of_stock") {
      stockCondition = eq(productVariants.stock, 0);
    } else if (params.stockStatus === "low") {
      stockCondition = and(
        sql`${productVariants.stock} > 0`,
        sql`${productVariants.stock} <= ${productVariants.minStock}`
      );
    } else if (params.stockStatus === "safe") {
      stockCondition = sql`${productVariants.stock} > ${productVariants.minStock}`;
    }

    const conditions = [];
    if (stockCondition) conditions.push(stockCondition);
    if (params.category) {
      conditions.push(eq(products.categoryId, params.category));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        variantId: productVariants.id,
        productId: products.id,
        productName: products.name,
        collection: products.collection,
        sku: productVariants.sku,
        size: productVariants.size,
        color: productVariants.color,
        stock: productVariants.stock,
        minStock: productVariants.minStock,
        maxStock: productVariants.maxStock,
        categoryName: sql<string>`(
          SELECT c.name FROM categories c WHERE c.id = ${products.categoryId}
        )`,
        supplierName: sql<string>`(
          SELECT s.name FROM suppliers s WHERE s.id = ${products.supplierId}
        )`,
        updatedAt: productVariants.updatedAt,
        imageUrl: sql<string>`(
          SELECT pi.url FROM product_images pi 
          WHERE pi.product_id = ${products.id} AND pi.is_primary = true 
          LIMIT 1
        )`,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(where)
      .orderBy(productVariants.stock)
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(where);

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
   * Inventory statistics.
   */
  async getStats() {
    const result = await db
      .select({
        totalProducts: sql<number>`COUNT(DISTINCT ${products.id})::int`,
        totalVariants: sql<number>`COUNT(${productVariants.id})::int`,
        outOfStock: sql<number>`COUNT(*) FILTER (WHERE ${productVariants.stock} = 0)::int`,
        lowStock: sql<number>`COUNT(*) FILTER (WHERE ${productVariants.stock} > 0 AND ${productVariants.stock} <= ${productVariants.minStock})::int`,
        totalValuation: sql<string>`COALESCE(SUM(${productVariants.stock}::numeric * COALESCE(${productVariants.priceOverride}::numeric, ${products.basePrice}::numeric)), 0)`,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id));

    return result[0];
  },

  /**
   * Manual stock adjustment (stock opname).
   */
  async adjustStock(
    variantId: string,
    newStock: number,
    notes: string,
    userId: string
  ) {
    const [variant] = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.id, variantId));

    if (!variant) throw new Error("Variant not found");

    const quantityChange = newStock - variant.stock;

    // Update stock
    await db
      .update(productVariants)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(productVariants.id, variantId));

    // Log the adjustment
    await db.insert(inventoryLogs).values({
      variantId,
      type: "adjustment",
      quantityChange,
      stockAfter: newStock,
      notes,
      createdBy: userId,
    });

    return { variantId, previousStock: variant.stock, newStock, quantityChange };
  },

  /**
   * Get inventory change logs.
   */
  async getLogs(params: {
    variantId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (params.variantId) {
      conditions.push(eq(inventoryLogs.variantId, params.variantId));
    }
    if (params.type) {
      conditions.push(
        eq(
          inventoryLogs.type,
          params.type as
            | "sale"
            | "restock"
            | "adjustment"
            | "return"
            | "initial"
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.inventoryLogs.findMany({
      where,
      with: {
        variant: {
          with: {
            product: { columns: { name: true } },
          },
        },
        createdByUser: { columns: { name: true } },
      },
      orderBy: [desc(inventoryLogs.createdAt)],
      limit,
      offset,
    });

    return data;
  },

  /**
   * Get incoming shipments (purchase orders).
   */
  async getShipments() {
    return db.query.purchaseOrders.findMany({
      with: {
        supplier: { columns: { id: true, name: true } },
        items: {
          with: {
            variant: {
              with: {
                product: { columns: { name: true } },
              },
            },
          },
        },
      },
      orderBy: [desc(purchaseOrders.createdAt)],
      limit: 10,
    });
  },

  /**
   * Create a purchase order (restock request).
   */
  async createPurchaseOrder(data: {
    orderNumber: string;
    supplierId: string;
    expectedDate?: string;
    notes?: string;
    items: Array<{ variantId: string; quantity: number; unitCost: string }>;
    createdBy: string;
  }) {
    const totalCost = data.items
      .reduce((sum, item) => sum + parseFloat(item.unitCost) * item.quantity, 0)
      .toFixed(2);

    const [po] = await db
      .insert(purchaseOrders)
      .values({
        orderNumber: data.orderNumber,
        supplierId: data.supplierId,
        expectedDate: data.expectedDate,
        totalCost,
        notes: data.notes,
        createdBy: data.createdBy,
      })
      .returning();

    // Insert PO items
    if (data.items.length > 0) {
      await db.insert(purchaseOrderItems).values(
        data.items.map((item) => ({
          purchaseOrderId: po.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitCost: item.unitCost,
        }))
      );
    }

    return po;
  },

  /**
   * Update PO status. When marked 'delivered', auto-restock variants.
   */
  async updatePurchaseOrderStatus(
    id: string,
    status: "draft" | "ordered" | "in_transit" | "delivered" | "cancelled",
    userId: string
  ) {
    const [po] = await db
      .update(purchaseOrders)
      .set({ status, updatedAt: new Date() })
      .where(eq(purchaseOrders.id, id))
      .returning();

    // Auto-restock on delivery
    if (status === "delivered") {
      const items = await db
        .select()
        .from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.purchaseOrderId, id));

      for (const item of items) {
        // Get current stock
        const [variant] = await db
          .select()
          .from(productVariants)
          .where(eq(productVariants.id, item.variantId));

        if (variant) {
          const newStock = variant.stock + item.quantity;

          // Update stock
          await db
            .update(productVariants)
            .set({ stock: newStock, updatedAt: new Date() })
            .where(eq(productVariants.id, item.variantId));

          // Log restock
          await db.insert(inventoryLogs).values({
            variantId: item.variantId,
            type: "restock",
            quantityChange: item.quantity,
            stockAfter: newStock,
            referenceId: id,
            notes: `Restock from PO ${po.orderNumber}`,
            createdBy: userId,
          });
        }
      }
    }

    return po;
  },
};
