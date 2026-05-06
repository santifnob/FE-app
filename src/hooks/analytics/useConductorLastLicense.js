import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './conductorKeys.js';
import { api } from "../../services/api.js";

export function useConductorLastLicense(conductorId) {
  return useQuery({
    queryKey: [dashboardKeys.lastLicenseConductor(), conductorId],
    queryFn: async () => {
      if (!conductorId) return null;

      const res = await api.get('/licencia', {
        params: { conductorId, limit: 1 },
        withCredentials: true
      });

      const items = res.data.items ?? res.data.result ?? [];
      // Retornar la primera licencia (la más reciente)
      return items.length > 0 ? items[0] : null;
    },
    enabled: !!conductorId,
    staleTime: 1000 * 60 * 5,
  });
};