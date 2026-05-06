import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../../hooks/analytics/useUpcomingTrips.js";
import { PiWarningOctagon } from "react-icons/pi";
import { useConductorKilometers } from "../../../hooks/analytics/useConductorKilometers.js";
import { useCurrentUser } from "../../../hooks/useCurrentUser.js";

export default function ConductorKilometersWidget() {
  const { user, isLoading: userLoading } = useCurrentUser()
  const {
    data: kilometers = 0,
    isLoading,
    isError,
    error,
  } = useConductorKilometers(user?.id)

  return (
    <DashboardCardShell
      title="Kilómetros Recorridos"
      subtitle="Total de kilómetros recorridos"
      badge={`${kilometers.toLocaleString('es-AR')} km`}
      loading={isLoading || userLoading}
      error={isError ? error : null}
      fallback={kilometers === 0 && !isLoading && !userLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay viajes finalizados con kilómetros registrados.</div>
      ) : null}
    >
      {/* Aquí podrías agregar un gráfico o más detalles si lo deseas */}
    </DashboardCardShell>
  );
}