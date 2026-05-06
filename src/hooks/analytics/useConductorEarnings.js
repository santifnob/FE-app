import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from './conductorKeys.js';
import { api } from "../../services/api.js";

export function useConductorEarnings(conductorId) {
  return useQuery({
    queryKey: [dashboardKeys.earningsConductor(), conductorId],
    queryFn: async () => {
      if (!conductorId) return 0

      const res = await api.get('/viaje', {
        params: {
          conductorId,
          estado: 'Activo'
        },
        withCredentials: true
      })

      const items = res.data.items ?? res.data.result ?? []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return items.reduce((total, viaje) => {
        const fechaFinRaw = viaje.fechaFin ?? viaje.fecha_fin
        const fechaFin = fechaFinRaw ? new Date(fechaFinRaw) : null
        if (!fechaFin || Number.isNaN(fechaFin.getTime()) || fechaFin > today) {
          return total
        }

        const lines = viaje.lineasCarga ?? viaje.lineaCarga ?? viaje.lineas ?? []
        const tripTotal = (Array.isArray(lines) ? lines : []).reduce((sum, linea) => {
          if (linea.estado !== 'Activo') return sum

          const cantVagon = Number(linea.cantVagon ?? linea.cantidadVagon ?? linea.cant_vagon ?? 0)
          const precio = Number(linea.carga?.precio ?? linea.precio ?? 0)

          if (!Number.isFinite(cantVagon) || !Number.isFinite(precio)) return sum
          return sum + cantVagon * precio
        }, 0)

        return total + tripTotal
      }, 0)
    },
    enabled: !!conductorId,
    staleTime: 1000 * 60 * 5, // Los stats pueden durar 5 min en caché
  });
};