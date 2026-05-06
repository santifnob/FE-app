import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useConductorPendingTrips(conductorId) {
  return useQuery({
    queryKey: ['conductorPendingTrips', conductorId],
    queryFn: async () => {
      if (!conductorId) return []

      const res = await api.get('/viaje', {
        params: { conductorId, estado: 'Pendiente' },
        withCredentials: true
      })

      const items = res.data.items ?? res.data.result ?? []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return items.filter((viaje) => {
        const rawDate = viaje.fechaIni ?? viaje.fecha_ini ?? viaje.fechaHoraSalida ?? viaje.fecha_hora_salida
        const date = rawDate ? new Date(rawDate) : null
        return date && !Number.isNaN(date.getTime()) && date >= today
      })
    },
    enabled: !!conductorId,
  })
}
