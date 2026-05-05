import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

export function useCancellationRisk() {
  return useQuery({
    queryKey: dashboardKeys.cancellationRisk(),
    queryFn: async () => {
      const res = await api.get("/analytics/cancellation-risk-stats", { withCredentials: true });
      return res.data.result;
    },
    staleTime: 1000 * 60 * 10,
  });
}