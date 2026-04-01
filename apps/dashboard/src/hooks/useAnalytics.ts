import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";

export const analyticsKeys = {
  all: ["analytics"] as const,
  revenueTrend: () => [...analyticsKeys.all, "revenue-trend"] as const,
  annualQuota: () => [...analyticsKeys.all, "annual-quota"] as const,
  topCategories: () => [...analyticsKeys.all, "top-categories"] as const,
  regional: () => [...analyticsKeys.all, "regional"] as const,
  efficiency: () => [...analyticsKeys.all, "efficiency"] as const,
};

export function useRevenueTrend() {
  return useQuery({
    queryKey: analyticsKeys.revenueTrend(),
    queryFn: () => analyticsService.getRevenueTrend(),
  });
}

export function useAnnualQuota() {
  return useQuery({
    queryKey: analyticsKeys.annualQuota(),
    queryFn: () => analyticsService.getAnnualQuota(),
  });
}

export function useTopCategories() {
  return useQuery({
    queryKey: analyticsKeys.topCategories(),
    queryFn: () => analyticsService.getTopCategories(),
  });
}

export function useRegionalData() {
  return useQuery({
    queryKey: analyticsKeys.regional(),
    queryFn: () => analyticsService.getRegionalData(),
  });
}

export function useEfficiency() {
  return useQuery({
    queryKey: analyticsKeys.efficiency(),
    queryFn: () => analyticsService.getEfficiency(),
  });
}
