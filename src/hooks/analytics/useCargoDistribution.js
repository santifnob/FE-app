import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

export function useCargoDistribution() {
  return useQuery({
    queryKey: dashboardKeys.cargoDistribution(),
    queryFn: async () => {
      const res = await api.get("/analytics/cargo-distribution", { withCredentials: true });
      return res.data.result;
    },
    staleTime: 1000 * 60 * 15,
  });
}