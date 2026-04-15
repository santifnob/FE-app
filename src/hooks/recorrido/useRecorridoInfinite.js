import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useRecorridosInfinite( { filters = {} } ) {
  return useInfiniteQuery({
    queryKey: ["recorridosInfinite", filters],
    queryFn: async ({ pageParam = null }) => {
      const params = {
        limit: 10,
        cursor: pageParam,
        ...filters
      }
      const res = await api.get("/recorrido", {
        params,
        withCredentials: true
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}