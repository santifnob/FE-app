import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api'

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await api.post('auth/logout', {}, { withCredentials: true })
    }
  })
}
