import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useLineaCargaPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['lineaCargaPost'],
    mutationFn: async (lineaCarga) => {
      await api.post('/lineaCarga', lineaCarga, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lineaCargasQuery'])
    }
  })
}
