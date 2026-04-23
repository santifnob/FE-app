import { Card, Badge, ListGroup } from 'react-bootstrap'

const badgeVariant = (days) => {
  if (days < 7) return 'danger'
  if (days < 15) return 'warning'
  return 'secondary'
}

export default function LicenseAlertsWidget({ alerts }) {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="widget-header">
          <div>
            <Card.Title className="mb-1">Alertas de licencias</Card.Title>
            <Card.Subtitle className="text-muted">Conductores con vencimiento próximo</Card.Subtitle>
          </div>
          <div className="widget-badge">Prioridad</div>
        </div>

        <ListGroup variant="flush" className="license-feed">
          {alerts.map((item) => (
            <ListGroup.Item key={item.id} className="license-item px-0 py-3">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div className="fw-semibold">{item.conductor}</div>
                  <div className="text-muted small">Licencia: {item.licencia}</div>
                </div>
                <Badge bg={badgeVariant(item.diasRestantes)} className="text-uppercase py-2 px-3 small">
                  {item.diasRestantes} días
                </Badge>
              </div>
              <div className="text-muted small mt-2">Vencimiento: {item.vencimiento}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}
