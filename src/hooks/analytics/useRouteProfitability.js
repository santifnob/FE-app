import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

const rawRouteData = [
  {
    id: "R01",
    recorrido: { origen: "Rosario", destino: "Retiro", totalKm: 312 },
    carga: { precio: 90000 },
    lineaCarga: { cantidad: 22 },
  },
  {
    id: "R02",
    recorrido: { origen: "Rosario", destino: "Paraná", totalKm: 177 },
    carga: { precio: 68000 },
    lineaCarga: { cantidad: 14 },
  },
  {
    id: "R03",
    recorrido: { origen: "Retiro", destino: "Tigre", totalKm: 35 },
    carga: { precio: 42000 },
    lineaCarga: { cantidad: 12 },
  },
  {
    id: "R04",
    recorrido: { origen: "Junín", destino: "Retiro", totalKm: 260 },
    carga: { precio: 112000 },
    lineaCarga: { cantidad: 18 },
  },
  {
    id: "R05",
    recorrido: { origen: "Rosario", destino: "Cañada de Gómez", totalKm: 55 },
    carga: { precio: 52000 },
    lineaCarga: { cantidad: 9 },
  },
];

const mockRouteProfitability = rawRouteData.map((item) => ({
  id: item.id,
  routeName: `${item.recorrido.origen} - ${item.recorrido.destino}`,
  profitPerKm: Number(
    ((item.carga.precio * item.lineaCarga.cantidad) / item.recorrido.totalKm).toFixed(0)
  ),
}));

export function useRouteProfitability() {
  return useQuery({
    queryKey: dashboardKeys.routeProfitability(),
    queryFn: async () => {
      const res = await api.get("/analytics/route-profitability", { withCredentials: true });
      return res.data.result;
    },
    initialData: mockRouteProfitability,
    staleTime: 1000 * 60 * 10,
  });
}
