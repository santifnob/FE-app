import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useObservacionPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['observacionPut'],
    mutationFn: async (observacion) => {
      await api.put('/observacion/' + observacion.id, observacion, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['observacionesQuery'])
    }
  })
}
