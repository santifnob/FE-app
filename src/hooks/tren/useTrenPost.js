import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useTrenPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['trenPost'],
    mutationFn: async (tren) => {
      await api.post('/tren', tren, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trenesQuery'])
    }
  })
}
