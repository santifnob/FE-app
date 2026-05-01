import { Card, Spinner, Alert } from 'react-bootstrap'

export default function DashboardCardShell({
  title,
  subtitle,
  badge,
  loading,
  error,
  fallback,
  children,
  className = "",
  isChart=false,
}) {
  return (
    <Card className={`dashboard-card ${className}`}>
      <Card.Body>
        <div className="widget-header">
          <div>
            <Card.Title className="mb-1">{title}</Card.Title>
            <Card.Subtitle className="text-muted">{subtitle}</Card.Subtitle>
          </div>
          {badge && <div className="widget-badge">{badge}</div>}
        </div>
        <div className={`widget-content ${isChart ? 'no-scroll' : ''}`}>
          {loading ? (
          <div className="widget-placeholder">
            <Spinner animation="border" size="sm" className="me-2" />
            <span className="text-muted">Cargando datos...</span>
          </div>
          ) : error ? (
            <Alert variant="danger" className="py-3 mb-0">
              {error?.message ?? 'Error al cargar datos'}
            </Alert>
          ) : fallback ? (
            fallback
          ) : (
            children
          )}
        </div>
        
      </Card.Body>
    </Card>
  )
}
