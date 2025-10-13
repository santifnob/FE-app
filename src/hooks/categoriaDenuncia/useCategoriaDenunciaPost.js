import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useCategoriaDenunciaPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['categoriaDenunciaPost'],
    mutationFn: async (categoriaDenuncia) => {
      await api.post('/categoriaDenuncia', categoriaDenuncia, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categoriaDenunciasQuery'])
    }
  })
}
