import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useRecorridoPut () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['recorridoPut'],
    mutationFn: async (recorrido) => {
      await api.put('/recorrido/'+recorrido.id, recorrido, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recorridosQuery'])
    }
  })
}
