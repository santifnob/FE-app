import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useRecorridoPost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['recorridoPost'],
    mutationFn: async (recorrido) => {
      await api.post('/recorrido', recorrido, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recorridosQuery'])
    }
  })
}
