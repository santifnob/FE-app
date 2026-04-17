import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useConductoresInfinite ( {filters = {}} ) {
  return useInfiniteQuery({
    queryKey: ['conductoresInfinite', filters],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get('/conductor', {
        params: {
          limit: 10,
          cursor: pageParam,
          ...filters,
        },
        withCredentials: true
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}
