import { api } from '../../services/api.js'
import { useQuery, useMutation } from '@tanstack/react-query'

export function LineaCargaFindAll () {
  return (useQuery({
    queryKey: ['lineaCargaFindAll'],
    queryFn: async () => {
      const res = await api.get('/lineaCarga', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function LineaCargaGetOne () {
  return useMutation({
    mutationKey: ['lineaCargaGetOne'],
    mutationFn: async (lineaCargaId) => {
      console.log(`/lineaCarga/${lineaCargaId}`)
      const lineaCarga = await api.get(`/lineaCarga/${lineaCargaId}`, { withCredentials: true })
      return lineaCarga.data.items
    }
  })
}