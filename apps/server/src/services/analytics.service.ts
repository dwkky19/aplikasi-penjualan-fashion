import { db } from "../db/index.js";
import {
  transactions,
  transactionItems,
  products,
  productVariants,
  categories,
} from "../db/schema.js";
import { eq, sql, and, gte, desc } from "drizzle-orm";

export const analyticsService = {
  /**
   * Monthly revenue trend by category for the area chart.
   */
  async getRevenueTrend() {
    const result = await db.execute(sql`
      SELECT 
        TO_CHAR(t.created_at, 'Mon') as month,
        EXTRACT(MONTH FROM t.created_at)::int as month_num,
        c.name as category,
        COALESCE(SUM(ti.subtotal::numeric), 0)::float as revenue
      FROM ${transactionItems} ti
      INNER JOIN ${transactions} t ON ti.transaction_id = t.id
      INNER JOIN ${productVariants} pv ON ti.variant_id = pv.id
      INNER JOIN ${products} p ON pv.product_id = p.id
      LEFT JOIN ${categories} c ON p.category_id = c.id
      WHERE t.status = 'completed'
        AND t.created_at >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY month, month_num, c.name
      ORDER BY month_num
    `);

    return Array.isArray(result) ? result : [];
  },

  /**
   * Annual sales quota: target vs achieved.
   */
  async getAnnualQuota() {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const result = await db
      .select({
        achieved: sql<string>`COALESCE(SUM(${transactions.total}::numeric), 0)`,
      })
      .from(transactions)
      .where(
        and(
          gte(transactions.createdAt, yearStart),
          eq(transactions.status, "completed")
        )
      );

    // Target is configurable – hardcoded for now
    const target = 5600000000; // Rp 5.6M (as shown in UI)
    const achieved = parseFloat(result[0]?.achieved || "0");
    const percentage = target > 0 ? ((achieved / target) * 100).toFixed(1) : "0";

    return {
      target: target.toFixed(2),
      achieved: achieved.toFixed(2),
      percentage: `${percentage}%`,
    };
  },

  /**
   * Top categories by sales volume with growth %.
   */
  async getTopCategories() {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const result = await db.execute(sql`
      WITH current_period AS (
        SELECT 
          c.id as category_id,
          c.name as category,
          COALESCE(SUM(ti.subtotal::numeric), 0)::float as revenue
        FROM ${categories} c
        LEFT JOIN ${products} p ON p.category_id = c.id
        LEFT JOIN ${productVariants} pv ON pv.product_id = p.id
        LEFT JOIN ${transactionItems} ti ON ti.variant_id = pv.id
        LEFT JOIN ${transactions} t ON ti.transaction_id = t.id 
          AND t.status = 'completed'
          AND t.created_at >= ${thisMonthStart}
        GROUP BY c.id, c.name
      ),
      previous_period AS (
        SELECT 
          c.id as category_id,
          COALESCE(SUM(ti.subtotal::numeric), 0)::float as revenue
        FROM ${categories} c
        LEFT JOIN ${products} p ON p.category_id = c.id
        LEFT JOIN ${productVariants} pv ON pv.product_id = p.id
        LEFT JOIN ${transactionItems} ti ON ti.variant_id = pv.id
        LEFT JOIN ${transactions} t ON ti.transaction_id = t.id 
          AND t.status = 'completed'
          AND t.created_at >= ${lastMonthStart}
          AND t.created_at < ${thisMonthStart}
        GROUP BY c.id
      )
      SELECT 
        cp.category,
        cp.revenue::float as current_revenue,
        COALESCE(pp.revenue, 0)::float as previous_revenue,
        CASE 
          WHEN COALESCE(pp.revenue, 0) = 0 THEN 0
          ELSE ROUND(((cp.revenue - pp.revenue) / pp.revenue * 100)::numeric, 1)::float
        END as growth_percentage
      FROM current_period cp
      LEFT JOIN previous_period pp ON cp.category_id = pp.category_id
      ORDER BY cp.revenue DESC
    `);

    return Array.isArray(result) ? result : [];
  },

  /**
   * Regional sales data (placeholder — would need a region field on transactions).
   */
  async getRegionalData() {
    // Since the current schema doesn't have regions, return aggregate data
    const result = await db
      .select({
        activeOrders: sql<number>`COUNT(*) FILTER (WHERE ${transactions.status} = 'pending')::int`,
        shipped: sql<number>`COUNT(*) FILTER (WHERE ${transactions.status} = 'completed')::int`,
        totalCompleted: sql<number>`COUNT(*) FILTER (WHERE ${transactions.status} = 'completed')::int`,
      })
      .from(transactions);

    return {
      activeOrders: result[0]?.activeOrders || 0,
      shipped: result[0]?.shipped || 0,
      totalCompleted: result[0]?.totalCompleted || 0,
    };
  },

  /**
   * Stock efficiency / waste metrics.
   */
  async getEfficiency() {
    const result = await db
      .select({
        totalVariants: sql<number>`COUNT(*)::int`,
        totalStock: sql<number>`COALESCE(SUM(${productVariants.stock}), 0)::int`,
        totalMaxStock: sql<number>`COALESCE(SUM(${productVariants.maxStock}), 0)::int`,
      })
      .from(productVariants);

    const data = result[0];
    const utilizationRate =
      data.totalMaxStock > 0
        ? ((data.totalStock / data.totalMaxStock) * 100).toFixed(1)
        : "0";

    return {
      totalVariants: data.totalVariants,
      totalStock: data.totalStock,
      totalMaxStock: data.totalMaxStock,
      utilizationRate: `${utilizationRate}%`,
    };
  },
};
