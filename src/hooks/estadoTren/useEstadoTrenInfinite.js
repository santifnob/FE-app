import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

export function useEstadoTrenesInfinite() {
  return useInfiniteQuery({
    queryKey: ["estadoTrenesInfinite"],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/estadoTren", {
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

