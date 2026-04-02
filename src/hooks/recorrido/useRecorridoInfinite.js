import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useRecorridosInfinite( { filterColumn, filterValue } ) {
  return useInfiniteQuery({
    queryKey: ["recorridosInfinite", filterColumn, filterValue],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/recorrido", {
        params: { 
          limit: 10,
          cursor: pageParam,
          ...(filterColumn ? {filterColumn} : {}),
          ...(filterValue ? {filterValue} : {}) 
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