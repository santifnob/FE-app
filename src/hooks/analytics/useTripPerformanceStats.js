import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './keys';
import { api } from "../../services/api.js";

export function useTripPerformanceStats () {
  return useQuery({
    queryKey: dashboardKeys.tripQuality(),
    queryFn: async () => {
      const res = await api.get('/analytics/trip-performance-stats', { withCredentials: true })
      return res.data.result
    },
    staleTime: 1000 * 60 * 5, // Los stats pueden durar 5 min en caché
  });
};

