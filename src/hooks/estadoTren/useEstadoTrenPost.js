import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useEstadoTrenPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['estadoTrenPost'],
    mutationFn: async (estadoTren) => {
      await api.post('/estadoTren', estadoTren, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['estadoTrenesQuery'])
    }
  })
}
