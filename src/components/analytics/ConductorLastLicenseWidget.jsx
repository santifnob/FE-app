import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import DashboardCardShell from "../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../hooks/analytics/useUpcomingTrips.js";
import { PiWarningOctagon } from "react-icons/pi";
import { useConductorLastLicense } from "../../hooks/analytics/useConductorLastLicense.js";

export default function ConductorLastLicenseWidget() {
    const { data, isLoading, isError, error } = useConductorLastLicense();

    return (
        <DashboardCardShell
            title="Última Licencia"
            subtitle="Fecha de vencimiento de la última licencia del conductor"
            badge={data ? new Date(data.fechaVencimiento).toLocaleDateString('es-AR') : "Sin datos"}
            loading={isLoading}
            error={isError ? error : null}
            fallback={!data && !isLoading && !isError ? (
                <div className="text-center text-muted py-5">No hay datos de licencias disponibles.</div>
            ) : null}
        >
            {/* Aquí podrías agregar un gráfico o más detalles si lo deseas */}
        </DashboardCardShell>
    );
}