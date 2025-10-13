import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useTipoCargaPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['tipoCargaPut'],
    mutationFn: async (tipoCarga) => {
      await api.put('/tipoCarga/'+tipoCarga.id, tipoCarga, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tipoCargasQuery'])
    }
  })
}
