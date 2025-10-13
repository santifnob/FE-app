import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useObservacionPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['observacionPost'],
    mutationFn: async (observacion) => {
      await api.post('/observacion', observacion, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['observacionesQuery'])
    }
  })
}
