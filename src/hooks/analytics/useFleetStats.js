import useQuery from 'react-query';
import { dashboardKeys } from './keys';
import { api } from "../../services/api.js";

export const useFleetStats = () => {
  return useQuery({
    queryKey: dashboardKeys.fleetStatus(),
    queryFn: fetchFleetStats, // Llamada al backend específica
    staleTime: 1000 * 60 * 5, // Los stats pueden durar 5 min en caché
  });
};

async function fetchFleetStats() {
    const res = await api.get('/fleet-stats', { withCredentials: true })
    return res.data.items
}

