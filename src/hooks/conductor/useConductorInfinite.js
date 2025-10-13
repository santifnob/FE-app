import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useConductoresInfinite () {
  return useInfiniteQuery({
    queryKey: ['conductoresInfinite'],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get('/conductor', {
        params: { limit: 10, cursor: pageParam },
        withCredentials: true
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}
