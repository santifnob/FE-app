import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useConductorPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['conductorPut'],
    mutationFn: async (conductor) => {
      await api.put('/conductor/' + conductor.id, conductor, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conductoresQuery'])
    }
  })
}
