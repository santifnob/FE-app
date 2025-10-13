import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useCategoriaDenunciaPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['categoriaDenunciaPut'],
    mutationFn: async (categoriaDenuncia) => {
      await api.put('/categoriaDenuncia/'+categoriaDenuncia.id, categoriaDenuncia, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categoriaDenunciasQuery'])
    }
  })
}