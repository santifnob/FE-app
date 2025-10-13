import { api } from '../../services/api.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useRecorridosDelete () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['recorridoDelete'],
    mutationFn: async (idToDelete) => {
      await api.delete('/recorrido/' + idToDelete, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recorridosQuery'])
    }
  })
}
