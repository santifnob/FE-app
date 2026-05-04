import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

const mockCancellationRisk = {
  overallRate: 7.2, // percentage
  trend: "+0.5%", // vs last month
  topRiskRoutes: [
    { route: "Rosario-Bahía Blanca", rate: 8.4 },
    { route: "Retiro-Junín", rate: 7.8 },
    { route: "Luján-Paraná", rate: 6.9 },
  ],
};

export function useCancellationRisk() {
  return useQuery({
    queryKey: dashboardKeys.cancellationRisk(),
    queryFn: async () => {
      const res = await api.get("/analytics/cancellation-risk", { withCredentials: true });
      return res.data.result;
    },
    initialData: mockCancellationRisk,
    staleTime: 1000 * 60 * 10,
  });
}