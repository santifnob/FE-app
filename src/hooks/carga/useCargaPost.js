import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useCargaPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cargaPost'],
    mutationFn: async (carga) => {
      await api.post('/carga', carga, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cargasQuery'])
    }
  })
}
