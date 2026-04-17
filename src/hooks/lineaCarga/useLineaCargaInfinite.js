import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useLineaCargasInfinite ({ filters = {} } = {}) {
  return useInfiniteQuery({
    queryKey: ['lineaCargasInfinite', filters],
    queryFn: async ({ pageParam = null }) => {
      const params = { limit: 10, cursor: pageParam, ...filters }
      const res = await api.get('/lineaCarga', {
        params,
        withCredentials: true
      })
      return res.data // ← esto incluye items, hasNextPage y nextCursor

    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}
