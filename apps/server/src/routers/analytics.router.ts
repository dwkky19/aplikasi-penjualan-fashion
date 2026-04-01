import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { analyticsService } from "../services/analytics.service.js";

const router = Router();

/**
 * GET /api/analytics/revenue-trend
 * Monthly revenue by category for the area chart.
 */
router.get("/revenue-trend", requireAuth, async (_req, res, next) => {
  try {
    const data = await analyticsService.getRevenueTrend();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/annual-quota
 * Annual target vs achieved sales.
 */
router.get("/annual-quota", requireAuth, async (_req, res, next) => {
  try {
    const data = await analyticsService.getAnnualQuota();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/top-categories
 * Category performance with growth %.
 */
router.get("/top-categories", requireAuth, async (_req, res, next) => {
  try {
    const data = await analyticsService.getTopCategories();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/regional
 * Regional sales data.
 */
router.get("/regional", requireAuth, async (_req, res, next) => {
  try {
    const data = await analyticsService.getRegionalData();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/efficiency
 * Stock efficiency / utilization metrics.
 */
router.get("/efficiency", requireAuth, async (_req, res, next) => {
  try {
    const data = await analyticsService.getEfficiency();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
