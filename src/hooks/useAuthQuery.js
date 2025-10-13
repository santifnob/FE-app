import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api.js'

export function useAuthQuery (location) {
  return useQuery({
    queryKey: ['auth', location],
    queryFn: async () => {
      const res = await api.get('/auth/check', { withCredentials: true })
      return res.data.userData
    },
    retry: false
  })
}
