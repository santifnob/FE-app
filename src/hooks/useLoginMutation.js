import { api } from '../services/api.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLoginMutation () {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }) => {
      const res = await api.post('/auth/login', { user: { email, password } }, { withCredentials: true })
      return res.data.userData
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['auth'])
    }
  })
}
