import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useTrenesInfinite( { filterColumn, filterValue } ) {
  return useInfiniteQuery({
    queryKey: ["trenesInfinite", filterColumn, filterValue],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/tren", {
        params: { limit: 10, cursor: pageParam },
        withCredentials: true,
        ...( filterValue? {filterValue} : {}),
        ...( filterColumn? {filterColumn} : {})
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}

