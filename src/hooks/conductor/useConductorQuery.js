import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function ConductorFindAll() { // Obtiene todos los conductores
  return (useQuery({
    queryKey: ['conductorFindAll'],
    queryFn: async () => {
      const res = await api.get('/conductor', { withCredentials: true })
      return res.data.items
    }
  }))
}

// export function ConductorGetOne () { //Obtiene un conductor por ID
//   return useMutation({
//     mutationKey: ['conductorGetOne'],
//     mutationFn: async (conductorId) => {
//       console.log(`/conductor/${conductorId}`)
//       const conductor = await api.get(`/conductor/${conductorId}`, { withCredentials: true })
//       return conductor.data.items
//     }
//   })
// }

// Async function for use inside other hooks (e.g., queryFn)
export async function conductorGetOneAsync(id) {
  const res = await api.get(`/conductor/${id}`, {withCredentials: true})
  return res.data.data
}

// Hook for use at component level
export function ConductorGetOne(id) {
  return useQuery({
    queryKey: ['conductor', id],
    queryFn: async () => {
      return conductorGetOneAsync(id)
    },
    enabled: !!id // evita correr si no hay id
  })
}

export function ConductorActivos() { // Obtiene todos los conductores activos
  return useQuery({
    queryKey: ['conductorActivos'],
    queryFn: async () => {
      const res = await api.get('/conductor', {withCredentials: true})
      return res.data.items.filter(item => item.estado === 'Activo')
    }
  })
}

export function ConductorPendientes() { // Obtiene todos los conductores pendientes
  return useQuery({
    queryKey: ['conductorPendientes'],
    queryFn: async () => {
      const res = await api.get('/conductor', {withCredentials: true})
      return res.data.items.filter(item => item.estado === 'Pendiente')
    }
  })
}

export function ConductorInactivos() { // Obtiene todos los conductores inactivos
  return useQuery({
    queryKey: ['conductorInactivos'],
    queryFn: async () => {
      const res = await api.get('/conductor', {withCredentials: true})
      return res.data.items.filter(item => item.estado === 'Inactivo')
    }
  })
}

export function ConductorValidoViaje() { // Obtiene todos los conductores validos para un viaje
  return useQuery({
    queryKey: ['conductorValidoViaje'],
    queryFn: async () => {
      const res = await api.get('/conductor', { withCredentials: true})
      return res.data.items.filter(item => {
        return item.licencias.some(licencia => new Date(licencia.fechaVencimiento) > new Date()) // se puede agregar item.estado === 'Activo' && para la validacion (no esta agregado porque se podria haber hecho un viaje con un conductor que actualmente este inactivo)
      })
    }
  })
}
