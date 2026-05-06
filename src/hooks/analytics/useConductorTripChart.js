import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './conductorKeys.js';
import { api } from "../../services/api.js";
import { getEstadoInferido } from "../../shared/utils/viajeUtils.js";

function getInferredState(viaje) {
  return getEstadoInferido(viaje);
}

export function useConductorTripChart(conductorId) {
  return useQuery({
    queryKey: [dashboardKeys.tripChartConductor(), conductorId],
    queryFn: async () => {
      if (!conductorId) return []

      // Obtener TODOS los viajes del conductor sin límite de paginación
      const res = await api.get('/viaje', {
        params: {
          conductorId,
          limit: 10000 // Límite alto para obtener todos los viajes
        },
        withCredentials: true
      })

      const items = res.data.items ?? res.data.result ?? []
      const stateMap = {}

      items.forEach((viaje) => {
        const state = getInferredState(viaje)
        stateMap[state] = (stateMap[state] || 0) + 1
      })

      return Object.entries(stateMap).map(([stateName, stateCount]) => ({
        stateName,
        stateCount
      }))
    },
    enabled: !!conductorId,
    staleTime: 1000 * 60 * 5,
  });
};
