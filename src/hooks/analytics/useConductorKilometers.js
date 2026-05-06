import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useConductorKilometers(conductorId) {
  return useQuery({
    queryKey: ['conductorKilometers', conductorId],
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

      return items.reduce((sum, viaje) => {
        const fechaFinRaw = viaje.fechaFin ?? viaje.fechaFin ?? viaje.fechaFin ?? viaje.fechaFin
        const fechaFin = fechaFinRaw ? new Date(fechaFinRaw) : null
        if (!fechaFin || Number.isNaN(fechaFin.getTime()) || fechaFin > today) return sum

        const km = Number(viaje.recorrido.totalKm ?? viaje.recorrido.totalKm ?? viaje.km ?? viaje.recorrido.totalKm ?? 0)
        return sum + (Number.isFinite(km) ? km : 0)
      }, 0)
    },
    enabled: !!conductorId,
    staleTime: 1000 * 60 * 5,
  })
}