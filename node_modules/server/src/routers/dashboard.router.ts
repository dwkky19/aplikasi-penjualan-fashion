import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { dashboardService } from "../services/dashboard.service.js";

const router = Router();

/**
 * GET /api/dashboard/summary
 * KPI cards: total sales, transactions, gross profit, low stock alerts.
 */
router.get("/summary", requireAuth, async (req, res, next) => {
  try {
    const period = (req.query.period as "today" | "week" | "month") || "month";
    const summary = await dashboardService.getSummary(period);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dashboard/revenue-chart
 * Revenue data points for the chart visualization.
 */
router.get("/revenue-chart", requireAuth, async (req, res, next) => {
  try {
    const period =
      (req.query.period as "daily" | "weekly" | "monthly") || "daily";
    const data = await dashboardService.getRevenueChart(period);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dashboard/best-sellers
 * Top N best-selling products.
 */
router.get("/best-sellers", requireAuth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    const data = await dashboardService.getBestSellers(limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dashboard/stock-alerts
 * Products with stock below minimum threshold.
 */
router.get("/stock-alerts", requireAuth, async (req, res, next) => {
  try {
    const data = await dashboardService.getStockAlerts();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dashboard/recent-transactions
 * Latest transactions for the dashboard table.
 */
router.get("/recent-transactions", requireAuth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const data = await dashboardService.getRecentTransactions(limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
