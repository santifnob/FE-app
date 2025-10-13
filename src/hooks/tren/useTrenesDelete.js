import { api } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useTrenesDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['trenDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/tren/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trenesQuery'])
    }
  })
}
