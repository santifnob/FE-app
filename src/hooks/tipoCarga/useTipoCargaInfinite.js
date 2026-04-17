import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useTipoCargasInfinite({ filters = {} } = {}) {
  return useInfiniteQuery({
    queryKey: ["tipoCargasInfinite", filters],
    queryFn: async ({ pageParam = null }) => {
      const params = { limit: 10, cursor: pageParam, ...filters }
      const res = await api.get("/tipoCarga", {
        params,
        withCredentials: true,
      })
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    }
  })
}

