import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useTrenesInfinite({filters} = {}) {
  return useInfiniteQuery({
    queryKey: ["trenesInfinite", filters],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/tren", {
        params: {
          limit: 10,
          cursor: pageParam,
          ...filters,
        },
        withCredentials: true,
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}

