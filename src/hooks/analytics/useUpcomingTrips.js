import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

export function useUpcomingTrips() {
  return useQuery({
    queryKey: dashboardKeys.upcomingTrips(),
    queryFn: async () => {
      const res = await api.get("/analytics/upcoming-trips", { withCredentials: true });
      return res.data.result;
    },
    staleTime: 1000 * 60 * 5,
  });
}
