import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useObservacionesDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['observacionDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/observacion/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['observacionesQuery'])
    }
  })
}
