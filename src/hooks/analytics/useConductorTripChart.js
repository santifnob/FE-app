import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './conductorKeys.js';
import { api } from "../../services/api.js";

function getInferredState(viaje) {
  if (!viaje) return 'Sin Estado';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaIni = viaje.fechaIni ? new Date(viaje.fechaIni) : null;
  const fechaFin = viaje.fechaFin ? new Date(viaje.fechaFin) : null;

  if (!fechaIni || !fechaFin) return viaje.estado || 'Sin Estado';

  if (viaje.estado === 'Inactivo') {
    return 'Cancelado/Suspendido';
  }
  if (viaje.estado === 'Rechazado') {
    return 'Rechazado';
  }
  if (viaje.estado === 'Pendiente') {
    return fechaIni > hoy ? 'Pendiente' : 'Viaje no aceptado';
  }

  if (fechaFin < hoy) return 'Finalizado';
  if (fechaIni > hoy) return 'Programado';
  if (fechaIni <= hoy && fechaFin >= hoy) return 'En curso';

  return 'Sin Estado';
}

export function useConductorTripChart(conductorId) {
  return useQuery({
    queryKey: [dashboardKeys.tripChartConductor(), conductorId],
    queryFn: async () => {
      if (!conductorId) return []

      const res = await api.get('/viaje', {
        params: { conductorId },
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
