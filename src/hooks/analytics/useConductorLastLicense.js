import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './conductorKeys.js';
import { api } from "../../services/api.js";

export function useConductorLastLicense () {
  return useQuery({
    queryKey: dashboardKeys.lastLicenseConductor(),
    queryFn: async () => {
      const res = await api.get('/analytics/last-license-conductor', { withCredentials: true })
      return res.data.result
    },
    staleTime: 1000 * 60 * 5, // Los stats pueden durar 5 min en caché
  });
};