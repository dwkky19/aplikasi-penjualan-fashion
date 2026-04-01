import { api } from "../lib/api-client";

// ─── Types ───────────────────────────────────────────────

export interface RevenueTrendPoint {
  month: string;
  month_num: number;
  category: string | null;
  revenue: number;
}

export interface AnnualQuota {
  target: string;
  achieved: string;
  percentage: string;
}

export interface TopCategory {
  category: string;
  current_revenue: number;
  previous_revenue: number;
  growth_percentage: number;
}

export interface RegionalData {
  activeOrders: number;
  shipped: number;
  totalCompleted: number;
}

export interface EfficiencyData {
  totalVariants: number;
  totalStock: number;
  totalMaxStock: number;
  utilizationRate: string;
}

// ─── Service ─────────────────────────────────────────────

export const analyticsService = {
  getRevenueTrend: () =>
    api.get<RevenueTrendPoint[]>("/api/analytics/revenue-trend"),

  getAnnualQuota: () =>
    api.get<AnnualQuota>("/api/analytics/annual-quota"),

  getTopCategories: () =>
    api.get<TopCategory[]>("/api/analytics/top-categories"),

  getRegionalData: () =>
    api.get<RegionalData>("/api/analytics/regional"),

  getEfficiency: () =>
    api.get<EfficiencyData>("/api/analytics/efficiency"),
};
