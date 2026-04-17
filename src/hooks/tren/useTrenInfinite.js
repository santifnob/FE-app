import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "../../services/api.js"

const buildTrenFilterParams = (filters = {}) => {
  const filterKeys = Object.keys(filters)
  if (!filterKeys.length) return {}
  const filterColumn = filterKeys[0]
  const filterValue = filters[filterColumn]
  return filterColumn && filterValue ? { filterColumn, filterValue } : {}
}

export function useTrenesInfinite({ filters = {} } = {}) {
  const queryFilters = buildTrenFilterParams(filters)
  return useInfiniteQuery({
    queryKey: ["trenesInfinite", queryFilters],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/tren", {
        params: {
          limit: 10,
          cursor: pageParam,
          ...queryFilters,
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

