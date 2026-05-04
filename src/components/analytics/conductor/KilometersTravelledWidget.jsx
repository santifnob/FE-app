import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../../hooks/analytics/useUpcomingTrips.js";
import { PiWarningOctagon } from "react-icons/pi";
import { useConductorEarnings } from "../../../hooks/analytics/useConductorEarnings.js";

export default function ConductorKilometersWidget() {
  const { data, isLoading, isError, error } = useConductorEarnings();

  return (
    <DashboardCardShell
      title="Kilómetros Recorridos"
      subtitle="Total de kilómetros recorridos"
      badge={data ? `${data.toLocaleString('es-AR')} km` : "Sin datos"}
      loading={isLoading}
      error={isError ? error : null}
      fallback={!data && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de kilómetros disponibles.</div>
      ) : null}
    >
      {/* Aquí podrías agregar un gráfico o más detalles si lo deseas */}
    </DashboardCardShell>
  );
}