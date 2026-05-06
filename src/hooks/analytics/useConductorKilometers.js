import { useQuery } from '@tanstack/react-query'
import { dashboardKeys } from './conductorKeys.js'
import { api } from '../../services/api.js'

export function useConductorKilometers(conductorId) {
  return useQuery({
    queryKey: [dashboardKeys.kilometersConductor(), conductorId],
    queryFn: async () => {
      if (!conductorId) return 0

      const res = await api.get('/viaje', {
        params: {
          conductorId,
          limit: 10000 // Obtener todos los viajes
        },
        withCredentials: true
      })

      const items = res.data.items ?? res.data.result ?? []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Sumar totalKm desde el objeto recorrido de viajes activos finalizados
      return items
        .filter(viaje => viaje.estado === 'Activo' && new Date(viaje.fechaFin) <= today)
        .reduce((total, viaje) => {
          const km = viaje.recorrido?.totalKm ?? 0
          return total + (Number(km) || 0)
        }, 0)
    },
    enabled: !!conductorId,
    staleTime: 1000 * 60 * 5,
  })
}