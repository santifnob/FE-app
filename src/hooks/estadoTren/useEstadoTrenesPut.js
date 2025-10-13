import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useEstadoTrenPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['estadoTrenPut'],
    mutationFn: async (estadoTren) => {
      await api.put('/estadoTren/'+estadoTren.id, estadoTren, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['estadoTrenesQuery'])
    }
  })
}
