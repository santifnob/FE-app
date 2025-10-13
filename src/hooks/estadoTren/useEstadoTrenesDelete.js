import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useEstadoTrenesDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['estadoTrenDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/estadoTren/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['estadoTrenesQuery'])
    }
  })
}
