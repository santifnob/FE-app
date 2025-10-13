import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useLineaCargaPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['lineaCargaPut'],
    mutationFn: async (lineaCarga) => {
      await api.put('/lineaCarga/' + lineaCarga.id, lineaCarga, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lineaCargasQuery'])
    }
  })
}
