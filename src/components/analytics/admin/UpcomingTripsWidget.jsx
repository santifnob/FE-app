import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useUpcomingTrips } from "../../../hooks/analytics/useUpcomingTrips.js";
import { PiWarningOctagon } from "react-icons/pi";

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

  return (
    <DashboardCardShell
      title="Próximos Viajes"
      subtitle="Salidas activas programadas"
      badge={data.length ? `${data.length} viajes` : "Sin viajes disponibles"}
      loading={isLoading}
      error={isError ? error : null}
      fallback={data.length === 0 && !isLoading && !isError ? (
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
            {data.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.recorrido}</td>
                <td>{trip.conductor ?? "-"}</td>
                <td>{trip.tren ?? "-"}</td>
                <td className="text-end">
                  <div className="d-flex flex-column align-align-items-center gap-1">
                    <div className="d-flex align-items-center gap-2 justify-content-end">
                      <Badge bg={trip.estado === "Pendiente" ? "warning" : trip.estado === "Activo" ? "success" : "secondary"} pill>
                        {formatDate(trip.fechaIni)} 
                      </Badge>
                      {trip.estado === "Pendiente" && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              Viaje con id {trip.id} pendiente de confirmación de conductor.
                            </Tooltip>
                          }
                        >
                          <span className="d-inline-flex">
                            <PiWarningOctagon size={18} className="text-warning" />
                          </span>
                        </OverlayTrigger>
                      )}
                    </div>
                    <div className="text-muted small">{formatTime(trip.fechaIni)}</div>
                  </div> 
                  
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCardShell>
  );
}
