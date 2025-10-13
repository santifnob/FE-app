import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useTipoCargaPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['tipoCargaPost'],
    mutationFn: async (tipoCarga) => {
      await api.post('/tipoCarga', tipoCarga, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tipoCargasQuery'])
    }
  })
}
