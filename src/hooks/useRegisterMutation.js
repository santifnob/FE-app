import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api.js'

export function useRegisterMutation () {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (conductorData) => {
      await api.post('/conductor', conductorData)
    }
  })
}
