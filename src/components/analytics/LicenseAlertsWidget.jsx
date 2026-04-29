import { Card, Badge, ListGroup } from 'react-bootstrap'
import { useLicenseExpirationAlerts } from '../../hooks/analytics/useLicenseExpirationAlerts.js'
import DashboardCardShell from '../dashboard/DashboardCardShell.jsx'

const badgeVariant = (days) => {
  if (days < 15) return 'danger'
  if (days < 30) return 'warning'
  return 'secondary'
}

export default function LicenseAlertsWidget() {
  const { data: alerts = [], isLoading, isError, error } = useLicenseExpirationAlerts();

  const alertsArray = Array.isArray(alerts) ? alerts : []

  return (
    <DashboardCardShell
      title="Alerta de licencias"
      subtitle="Conductores con vencimiento próximo"
      badge="Prioridad"
      loading={isLoading}
      error={isError ? error : null}
      fallback={alertsArray.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de alertas de licencias disponibles.</div>
      ) : null}
    >
      <ListGroup variant="flush" className="license-feed">
          {alertsArray.map((item) => (
            <ListGroup.Item key={item.nombre + item.apellido} className="license-item px-0 py-3">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div className="fw-semibold">{item.nombre} {item.apellido}</div>
                  <div className="text-muted small">Licencia: {item.licencia_id}</div>
                </div>
                <Badge bg={badgeVariant(item.daysLeft)} className="text-uppercase py-2 px-3 small">
                  {item.daysLeft} días
                </Badge>
              </div>
              <div className="text-muted small mt-2">Vencimiento: {item.fecha_vencimiento.slice(0, 10)}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      
    </DashboardCardShell>
  )
}
