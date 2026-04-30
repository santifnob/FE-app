import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

export function useRouteProfitability() {
  return useQuery({
    queryKey: dashboardKeys.routeProfitability(),
    queryFn: async () => {
      const res = await api.get("/analytics/route-profitability-stats", { withCredentials: true });
      return res.data.result;
    },
    staleTime: 1000 * 60 * 10,
  });
}
