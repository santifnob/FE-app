import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useLicenciaPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['licenciaPost'],
    mutationFn: async (licencia) => {
      await api.post('/licencia', licencia, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['licenciasQuery'])
    }
  })
}
