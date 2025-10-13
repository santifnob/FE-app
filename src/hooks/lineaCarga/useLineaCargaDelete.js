import { api } from '../../services/api.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLineaCargasDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['lineaCargaDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/lineaCarga/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lineaCargasQuery'])
    }
  })
}
