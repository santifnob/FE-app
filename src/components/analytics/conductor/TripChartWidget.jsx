import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../../hooks/analytics/useUpcomingTrips.js";
import { PiWarningOctagon } from "react-icons/pi";
import { useConductorTripChart } from "../../../hooks/analytics/useConductorTripChart.js";

export default function ConductorTripChartWidget() {
    const { data, isLoading, isError, error } = useConductorTripChart();
    
    return (
        <DashboardCardShell
            title="Gráfico de Viajes"
            subtitle="Evolución de los viajes del conductor en el último período"
            badge={data && data.length > 0 ? `Último viaje: ${new Date(data[data.length - 1].fechaFin).toLocaleDateString('es-AR')}` : "Sin datos"}
            loading={isLoading}
            error={isError ? error : null}
            fallback={!data && !isLoading && !isError ? (
                <div className="text-center text-muted py-5">No hay datos de viajes disponibles.</div>
            ) : null}
        >
            {/* Aquí podrías agregar un gráfico utilizando una librería como Chart.js o Recharts */}
        </DashboardCardShell>
    );
} 
