import { api } from '../../services/api.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCargasDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cargaDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/carga/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cargasQuery'])
    }
  })
}
