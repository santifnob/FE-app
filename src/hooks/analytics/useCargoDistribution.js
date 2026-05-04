import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

const mockCargoDistribution = [
  { categoryName: "Granos", wagonCount: 45, revenueSharePercentage: 28.5 },
  { categoryName: "Minerales", wagonCount: 38, revenueSharePercentage: 24.1 },
  { categoryName: "Combustibles", wagonCount: 32, revenueSharePercentage: 20.3 },
  { categoryName: "Contenedores", wagonCount: 25, revenueSharePercentage: 15.8 },
  { categoryName: "Automóviles", wagonCount: 18, revenueSharePercentage: 11.4 },
  { categoryName: "Otros", wagonCount: 15, revenueSharePercentage: 9.5 },
];

export function useCargoDistribution() {
  return useQuery({
    queryKey: dashboardKeys.cargoDistribution(),
    queryFn: async () => {
      const res = await api.get("/analytics/cargo-distribution", { withCredentials: true });
      return res.data.result;
    },
    initialData: mockCargoDistribution,
    staleTime: 1000 * 60 * 15,
  });
}