import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useCargaPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cargaPut'],
    mutationFn: async (carga) => {
      await api.put('/carga/'+carga.id, carga, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cargasQuery'])
    }
  })
}
