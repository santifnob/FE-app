import { api } from '../../services/api'
import { useQuery, useMutation } from '@tanstack/react-query'

export function ObservacionFindAll () {
  return (useQuery({
    queryKey: ['observacionesQuery'],
    queryFn: async () => {
      const res = await api.get('/observacion', { withCredentials: true })
      return res.data.data
    }
  }))
}

export function ObservacionGetOne () {
  return useMutation({
    mutationKey: ['observacionQuery'],
    mutationFn: async (observacionId) => {
      console.log(`/observacion/${observacionId}`)
      const observacion = await api.get(`/observacion/${observacionId}`, { withCredentials: true })
      return observacion.data.data
    }
  })
}