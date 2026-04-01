import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (period: string) => [...dashboardKeys.all, "summary", period] as const,
  revenueChart: (period: string) => [...dashboardKeys.all, "revenue-chart", period] as const,
  bestSellers: (limit: number) => [...dashboardKeys.all, "best-sellers", limit] as const,
  stockAlerts: () => [...dashboardKeys.all, "stock-alerts"] as const,
  recentTransactions: (limit: number) => [...dashboardKeys.all, "recent-transactions", limit] as const,
};

export function useDashboardSummary(period: string = "month") {
  return useQuery({
    queryKey: dashboardKeys.summary(period),
    queryFn: () => dashboardService.getSummary(period),
  });
}

export function useRevenueChart(period: string = "daily") {
  return useQuery({
    queryKey: dashboardKeys.revenueChart(period),
    queryFn: () => dashboardService.getRevenueChart(period),
  });
}

export function useBestSellers(limit: number = 4) {
  return useQuery({
    queryKey: dashboardKeys.bestSellers(limit),
    queryFn: () => dashboardService.getBestSellers(limit),
  });
}

export function useStockAlerts() {
  return useQuery({
    queryKey: dashboardKeys.stockAlerts(),
    queryFn: () => dashboardService.getStockAlerts(),
  });
}

export function useRecentTransactions(limit: number = 5) {
  return useQuery({
    queryKey: dashboardKeys.recentTransactions(limit),
    queryFn: () => dashboardService.getRecentTransactions(limit),
  });
}
