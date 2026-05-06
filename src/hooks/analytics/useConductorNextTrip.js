import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './conductorKeys.js';
import { api } from "../../services/api.js";

export function useConductorNextTrip(conductorId) {
  return useQuery({
    queryKey: [dashboardKeys.nextTripConductor(), conductorId],
    queryFn: async () => {
      if (!conductorId) return []

      const res = await api.get('/viaje', {
        params: {
          conductorId,
          limit: 10
        },
        withCredentials: true
      })

      const items = res.data.items ?? res.data.result ?? []
      // Filtrar viajes pendientes con fechaIni >= hoy y ordenar por fechaIni
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return items
        .filter(viaje => viaje.estado === 'Pendiente' && new Date(viaje.fechaIni) >= today)
        .sort((a, b) => new Date(a.fechaIni) - new Date(b.fechaIni))
        .slice(0, 5) // Top 5 próximos viajes
    },
    enabled: !!conductorId,
    staleTime: 1000 * 60 * 5,
  });
};