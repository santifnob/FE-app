import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useViajePost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['viajePost'],
    mutationFn: async (viaje) => {
      await api.post('/viaje', viaje, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['viajesQuery'])
    }
  })
}
