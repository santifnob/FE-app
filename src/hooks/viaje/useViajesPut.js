import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useViajePut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['viajePut'],
    mutationFn: async (viaje) => {
      await api.put('/viaje/'+viaje.id, viaje, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['viajesQuery'])
    }
  })
}
