import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function LicenciaFindAll () { //Obtiene todas las licencias
  return (useQuery({
    queryKey: ['licenciaFindAll'],
    queryFn: async () => {
      const res = await api.get('/licencia', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function LicenciaGetOne () { //Obtiene una licencia por ID
  return useMutation({
    mutationKey: ['licenciaGetOne'],
    mutationFn: async (licenciaId) => {
      console.log(`/licencia/${licenciaId}`)
      const licencia = await api.get(`/licencia/${licenciaId}`, { withCredentials: true })
      return licencia.data.items
    }
  })
}

export function LicenciaActivos () { //Obtiene todas las licencias activas
  return (useQuery({
    queryKey: ['licenciaActivos'],
    queryFn: async () => {
      const res = await api.get('/licencia', { withCredentials: true })
      return res.data.items.filter(item => item.estado === 'Activo') 
    }
  }))
}
