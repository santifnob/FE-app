import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../../services/api.js'

export function useConductoresInfinite ( { filterColumn, filterValue } ) {
  return useInfiniteQuery({
    queryKey: ['conductoresInfinite', filterColumn, filterValue], // dependencias para que se vuelva a ejecutar la query
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get('/conductor', {
        params: { 
          limit: 10,
          cursor: pageParam,
          ...(filterColumn ? { filterColumn } : {}), 
          ...(filterValue ? {filterValue}: {})},  // Validacion para evitar valores nulos 
        withCredentials: true
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}
