import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLicenciasDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['licenciaDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/licencia/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['licenciasQuery'])
    }
  })
}
