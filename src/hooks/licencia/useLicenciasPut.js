import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useLicenciaPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['licenciaPut'],
    mutationFn: async (licencia) => {
      await api.put('/licencia/' + licencia.id, licencia, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['licenciasQuery'])
    }
  })
}
