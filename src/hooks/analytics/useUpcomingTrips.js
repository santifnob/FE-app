import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";
import { api } from "../../services/api.js";

const mockUpcomingTrips = [
  {
    id: "VJ-1004",
    status: "Active",
    fechaIni: "2026-05-01T07:45:00Z",
    recorrido: { origen: "Rosario", destino: "Retiro", totalKm: 312 },
    conductor: { nombre: "María Pereyra" },
    tren: { modelo: "Siemens 3000" },
  },
  {
    id: "VJ-1010",
    status: "Active",
    fechaIni: "2026-05-01T10:15:00Z",
    recorrido: { origen: "Luján", destino: "Ciudadela", totalKm: 42 },
    conductor: { nombre: "Luciano Herrera" },
    tren: { modelo: "Emepa Alerce" },
  },
  {
    id: "VJ-1009",
    status: "Active",
    fechaIni: "2026-05-01T12:00:00Z",
    recorrido: { origen: "Junín", destino: "Retiro", totalKm: 260 },
    conductor: { nombre: "Ana Morales" },
    tren: { modelo: "Fiat Materfer" },
  },
  {
    id: "VJ-1013",
    status: "Active",
    fechaIni: "2026-05-01T14:20:00Z",
    recorrido: { origen: "Rosario", destino: "Cañada de Gómez", totalKm: 55 },
    conductor: { nombre: "Santiago Rojas" },
    tren: { modelo: "Alstom Alerce" },
  },
  {
    id: "VJ-1016",
    status: "Active",
    fechaIni: "2026-05-01T16:30:00Z",
    recorrido: { origen: "Retiro", destino: "Tigre", totalKm: 35 },
    conductor: { nombre: "Marta Bustos" },
    tren: { modelo: "Siemens 3000" },
  },
];

export function useUpcomingTrips() {
  return useQuery({
    queryKey: dashboardKeys.upcomingTrips(),
    queryFn: async () => {
      const res = await api.get("/analytics/upcoming-trips", { withCredentials: true });
      return res.data.result;
    },
    initialData: mockUpcomingTrips,
    staleTime: 1000 * 60 * 5,
  });
}
