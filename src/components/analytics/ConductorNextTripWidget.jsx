import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import DashboardCardShell from "../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../hooks/analytics/useUpcomingTrips.js";
import { PiWarningOctagon } from "react-icons/pi";
import { useConductorNextTrip } from "../../hooks/analytics/useConductorNextTrip.js";

export default function ConductorNextTripWidget() {
    const { data, isLoading, isError, error } = useConductorNextTrip();

    const nextTrip = data?.[0]; // Suponiendo que el primer viaje es el próximo

    return (
        <DashboardCardShell
            title="Próximo Viaje"
            subtitle="Detalles del próximo viaje programado para el conductor"
            badge={nextTrip ? new Date(nextTrip.fechaHoraSalida).toLocaleString('es-AR') : "Sin viajes programados"}
            loading={isLoading}
            error={isError ? error : null}
            fallback={!data && !isLoading && !isError ? (
                <div className="text-center text-muted py-5">No hay viajes programados.</div>
            ) : null}
        >
            {nextTrip && (
                <div>
                    <p><strong>Origen:</strong> {nextTrip.recorrido}</p>
                    {/* Aquí podrías agregar más detalles o un botón para ver el viaje completo */}
                </div>
            )}
        </DashboardCardShell>
    );
}
