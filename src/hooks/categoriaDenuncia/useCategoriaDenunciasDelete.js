import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCategoriaDenunciasDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['categoriaDenunciaDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/categoriaDenuncia/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categoriaDenunciasQuery'])
    }
  })
}
