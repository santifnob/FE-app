import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useTrenPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['trenPut'],
    mutationFn: async (tren) => {
      await api.put('/tren/'+tren.id, tren, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trenesQuery'])
    }
  })
}
