import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useTipoCargasDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tipoCargaDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/tipoCarga/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tipoCargasQuery'])
    }
  })
}
