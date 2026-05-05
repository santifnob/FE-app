/* import { useInfiniteQuery } from '@tanstack/react-query'
import axiosInstance from '../../services/axiosInstance'

// Hook para obtener viajes del conductor con paginación infinita
export function useViajesConductorInfinite(conductorId, estado) {
  return useInfiniteQuery({
    // La clave única para cachear los resultados
    queryKey: ['viajesConductor', conductorId, estado],

    // Función que obtiene los datos
    queryFn: async ({ pageParam = null }) => {
      // Si no hay conductor, retornamos vacío
      if (!conductorId) return { items: [], hasNextPage: false }

      // Llamada a la API
      const res = await axiosInstance.get('/viaje', {
        params: {
          limit: 10, // 10 viajes por página
          cursor: pageParam // Cursor para paginación
        }
      })

      // Filtramos los viajes que pertenecen a este conductor
      // y que tienen el estado indicado
      const filteredItems = res.data.items.filter(viaje => {
        const mismoConductor = viaje.conductor?.id === conductorId
        const mismoEstado = estado ? viaje.estado === estado : true
        return mismoConductor && mismoEstado
      })

      // Retornamos la estructura que espera React Query
      return {
        ...res.data, // Mantenemos hasNextPage, nextCursor
        items: filteredItems // Solo los viajes filtrados
      }
    },

    // Determinamos si hay más páginas
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    },

    // Solo se ejecuta si tenemos conductorId
    enabled: !!conductorId
  })
} */

import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js' // ← IMPORTACIÓN CORRECTA (con llaves)

export function useViajesConductorInfinite(conductorId, estado) {
  return useInfiniteQuery({
    queryKey: ['viajesConductor', conductorId, estado],
    queryFn: async ({ pageParam = null }) => {
      if (!conductorId) return { items: [], hasNextPage: false }

      const res = await api.get('/viaje', {
        params: {
          limit: 10,
          cursor: pageParam,
          conductorId,
          estado
        },
        withCredentials: true
      })

      return {
        ...res.data,
        items: res.data.items
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    },
    enabled: !!conductorId
  })
}
