import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useConductoresDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['conductorDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/conductor/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conductoresQuery'])
    }
  })
}
