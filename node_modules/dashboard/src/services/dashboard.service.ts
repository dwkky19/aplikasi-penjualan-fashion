import { api } from "../lib/api-client";

// ─── Types ───────────────────────────────────────────────

export interface DashboardSummary {
  totalSales: string;
  transactionCount: number;
  grossProfit: string;
  lowStockCount: number;
}

export interface RevenueChartPoint {
  label: string;
  value: number;
}

export interface BestSeller {
  productId: string;
  productName: string;
  sku: string;
  totalSold: number;
  imageUrl: string | null;
}

export interface StockAlert {
  variantId: string;
  productName: string;
  size: string | null;
  stock: number;
  minStock: number;
  updatedAt: string;
}

export interface RecentTransaction {
  id: string;
  invoiceNumber: string;
  customerName: string | null;
  total: string;
  paymentMethod: string;
  paymentDetail: string | null;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: string;
    variant: {
      product: { name: string };
    } | null;
  }>;
}

// ─── Service ─────────────────────────────────────────────

export const dashboardService = {
  getSummary: (period: string = "month") =>
    api.get<DashboardSummary>(`/api/dashboard/summary?period=${period}`),

  getRevenueChart: (period: string = "daily") =>
    api.get<RevenueChartPoint[]>(`/api/dashboard/revenue-chart?period=${period}`),

  getBestSellers: (limit: number = 4) =>
    api.get<BestSeller[]>(`/api/dashboard/best-sellers?limit=${limit}`),

  getStockAlerts: () =>
    api.get<StockAlert[]>("/api/dashboard/stock-alerts"),

  getRecentTransactions: (limit: number = 5) =>
    api.get<RecentTransaction[]>(`/api/dashboard/recent-transactions?limit=${limit}`),
};
