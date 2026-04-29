import { Badge } from "react-bootstrap";
import DashboardCardShell from "../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../hooks/analytics/useUpcomingTrips.js";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpcomingTripsWidget() {
  const { data = [], isLoading, isError, error } = useUpcomingTrips();
  const upcoming = data.slice(0, 5);

  return (
    <DashboardCardShell
      title="Próximos Viajes"
      subtitle="Salidas activas programadas"
      badge={upcoming.length ? `${upcoming.length} viajes` : "Sin viajes disponibles"}
      loading={isLoading}
      error={isError ? error : null}
      fallback={upcoming.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay viajes activos próximos.</div>
      ) : null}
      className="widget-wide"
    >
      <div className="table-responsive">
        <table className="table table-borderless table-sm mb-0">
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Conductor</th>
              <th>Tren</th>
              <th className="text-end">Salida</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((trip) => (
              <tr key={trip.id}>
                <td>{`${trip.recorrido.origen} - ${trip.recorrido.destino}`}</td>
                <td>{trip.conductor?.nombre ?? "-"}</td>
                <td>{trip.tren?.modelo ?? "-"}</td>
                <td className="text-end">
                  <Badge bg="primary" pill>
                    {formatDate(trip.fechaIni)}
                  </Badge>
                  <div className="text-muted small">{formatTime(trip.fechaIni)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCardShell>
  );
}
