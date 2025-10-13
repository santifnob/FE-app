import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useViajesInfinite() {
  return useInfiniteQuery({
    queryKey: ["viajesInfinite"],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/viaje", {
        params: { limit: 10, cursor: pageParam },
        withCredentials: true,
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}

