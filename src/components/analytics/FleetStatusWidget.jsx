import { Row, Col } from 'react-bootstrap'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import DashboardCardShell from '../dashboard/DashboardCardShell.jsx'
import { useFleetStats } from '../../hooks/analytics/useFleetStats.js'

export default function FleetStatusWidget() {
  const {
      data = [],
      isLoading,
      isError,
      error,
    } = useFleetStats()
  
  const dataArray = Array.isArray(data) ? data : []
  const total = dataArray.reduce((sum, item) => sum + item.stateCount, 0)

  return (
    <DashboardCardShell
      title="Estado de la flota"
      subtitle="Distribución de trenes por estado operativo"
      badge={dataArray.length ? `Total: ${total}` : 'Total: 0'}
      loading={isLoading}
      error={isError ? error : null}
      fallback={dataArray.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de estado de la flota disponibles.</div>
      ) : null}
    >
      <div className="widget-chart">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={dataArray}
              dataKey="stateCount"
              nameKey="stateName"
              innerRadius={70}
              outerRadius={100}
              cornerRadius={10}
              paddingAngle={3}
            >
              {dataArray.map((entry) => (
                <Cell key={entry.stateName} fill={getBackroundColorByState(entry.stateName)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, 'Trenes']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Row className="mt-3 gx-2 gy-2">
        {dataArray.map((item) => (
          <Col xs={6} key={item.stateName}>
            <div className="legend-item d-flex align-items-center gap-2">
              <span className="legend-dot" style={{ backgroundColor: getBackroundColorByState(item.stateName) }} />
              <div>
                <div className="fw-semibold">{item.stateName}</div>
                <div className="text-muted small">{item.stateCount} trenes</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </DashboardCardShell>
  )
}

const getBackroundColorByState = (state) => {
  switch (state) {
    case 'Disponible':
      return '#198754'
    case 'En viaje':
      return '#0d6efd'
    case 'En reparacion':
      return '#dc3545'
    case 'Obsoleto':
      return '#6c757d'
    default:
      return '#6c757d'
  }
}
