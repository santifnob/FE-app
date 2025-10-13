import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useConductorPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['conductorPost'],
    mutationFn: async (conductor) => {
      await api.post('/conductor', conductor, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conductorQuery'])
    }
  })
}
