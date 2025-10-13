import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useViajesDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['viajeDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/viaje/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['viajesQuery'])
    }
  })
}
