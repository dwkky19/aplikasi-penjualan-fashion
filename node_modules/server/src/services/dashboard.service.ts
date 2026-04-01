import { db } from "../db/index.js";
import {
  categories,
  products,
  productVariants,
  transactions,
  transactionItems,
} from "../db/schema.js";
import { sql, eq, and, lt, desc, gte } from "drizzle-orm";

export const dashboardService = {
  /**
   * Get summary KPI cards: total sales, transaction count, gross profit, low-stock count.
   */
  async getSummary(period: "today" | "week" | "month" = "month") {
    const now = new Date();
    let dateFrom: Date;

    switch (period) {
      case "today":
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Total sales & transaction count
    const salesResult = await db
      .select({
        totalSales: sql<string>`COALESCE(SUM(${transactions.total}), 0)`,
        transactionCount: sql<number>`COUNT(*)::int`,
      })
      .from(transactions)
      .where(
        and(
          gte(transactions.createdAt, dateFrom),
          eq(transactions.status, "completed")
        )
      );

    // Gross profit (sales - cost)
    const profitResult = await db
      .select({
        grossProfit: sql<string>`COALESCE(SUM(
          (${transactionItems.unitPrice}::numeric - COALESCE(${products.costPrice}::numeric, 0)) * ${transactionItems.quantity}
        ), 0)`,
      })
      .from(transactionItems)
      .innerJoin(
        transactions,
        eq(transactionItems.transactionId, transactions.id)
      )
      .innerJoin(
        productVariants,
        eq(transactionItems.variantId, productVariants.id)
      )
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(
        and(
          gte(transactions.createdAt, dateFrom),
          eq(transactions.status, "completed")
        )
      );

    // Low stock count
    const lowStockResult = await db
      .select({
        count: sql<number>`COUNT(*)::int`,
      })
      .from(productVariants)
      .where(
        sql`${productVariants.stock} <= ${productVariants.minStock}`
      );

    return {
      totalSales: salesResult[0]?.totalSales || "0",
      transactionCount: salesResult[0]?.transactionCount || 0,
      grossProfit: profitResult[0]?.grossProfit || "0",
      lowStockCount: lowStockResult[0]?.count || 0,
    };
  },

  /**
   * Revenue chart data grouped by period.
   */
  async getRevenueChart(period: "daily" | "weekly" | "monthly" = "daily") {
    let groupBy: string;
    let dateFormat: string;

    switch (period) {
      case "daily":
        groupBy = "hour";
        dateFormat = "HH24:00";
        break;
      case "weekly":
        groupBy = "day";
        dateFormat = "Dy";
        break;
      default:
        groupBy = "month";
        dateFormat = "Mon";
    }

    const result = await db.execute(sql`
      SELECT 
        TO_CHAR(${transactions.createdAt}, ${dateFormat}) as label,
        COALESCE(SUM(${transactions.total}::numeric), 0) as value
      FROM ${transactions}
      WHERE ${transactions.status} = 'completed'
      GROUP BY DATE_TRUNC(${groupBy}, ${transactions.createdAt}), label
      ORDER BY DATE_TRUNC(${groupBy}, ${transactions.createdAt})
      LIMIT 24
    `);

    return result;
  },

  /**
   * Best selling products by units sold.
   */
  async getBestSellers(limit = 4) {
    const result = await db
      .select({
        productId: products.id,
        productName: products.name,
        sku: sql<string>`MIN(${productVariants.sku})`,
        totalSold: sql<number>`SUM(${transactionItems.quantity})::int`,
        imageUrl: sql<string>`(
          SELECT pi.url FROM product_images pi 
          WHERE pi.product_id = ${products.id} AND pi.is_primary = true 
          LIMIT 1
        )`,
      })
      .from(transactionItems)
      .innerJoin(
        productVariants,
        eq(transactionItems.variantId, productVariants.id)
      )
      .innerJoin(products, eq(productVariants.productId, products.id))
      .innerJoin(
        transactions,
        eq(transactionItems.transactionId, transactions.id)
      )
      .where(eq(transactions.status, "completed"))
      .groupBy(products.id, products.name)
      .orderBy(sql`SUM(${transactionItems.quantity}) DESC`)
      .limit(limit);

    return result;
  },

  /**
   * Products below minimum stock threshold.
   */
  async getStockAlerts() {
    const result = await db
      .select({
        variantId: productVariants.id,
        productName: products.name,
        size: productVariants.size,
        stock: productVariants.stock,
        minStock: productVariants.minStock,
        updatedAt: productVariants.updatedAt,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(
        sql`${productVariants.stock} <= ${productVariants.minStock}`
      )
      .orderBy(productVariants.stock)
      .limit(10);

    return result;
  },

  /**
   * Recent transactions for the dashboard table.
   */
  async getRecentTransactions(limit = 5) {
    const result = await db.query.transactions.findMany({
      with: {
        items: {
          with: {
            variant: {
              with: {
                product: {
                  columns: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: [desc(transactions.createdAt)],
      limit,
    });

    return result;
  },
};
