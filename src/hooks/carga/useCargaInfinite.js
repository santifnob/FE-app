import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useCargasInfinite() {
  return useInfiniteQuery({
    queryKey: ["cargasInfinite"],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/carga", {
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

