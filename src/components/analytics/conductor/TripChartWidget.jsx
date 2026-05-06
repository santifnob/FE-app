import { Row, Col } from 'react-bootstrap'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useConductorTripChart } from "../../../hooks/analytics/useConductorTripChart.js";
import { EstadoBadge } from '../../viaje/EstadoBadge.jsx';

export default function ConductorTripChartWidget() {
  const { user, isLoading: userLoading } = useCurrentUser()
  const { data = [], isLoading, isError, error } = useConductorTripChart(user?.id)

  const dataArray = Array.isArray(data) ? data : []
  const total = dataArray.reduce((sum, item) => sum + item.stateCount, 0)

  return (
    <DashboardCardShell
      title="Gráfico de Viajes"
      subtitle="Distribución de viajes por estado inferido"
      badge={dataArray.length ? `Total: ${total}` : 'Total: 0'}
      loading={isLoading || userLoading}
      error={isError ? error : null}
      fallback={dataArray.length === 0 && !isLoading && !userLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de viajes disponibles.</div>
      ) : null}
      isChart={true}
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
                <Cell key={entry.stateName} fill={getBackgroundColorByState(entry.stateName)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Row className="mt-3 gx-2 gy-2">
        {dataArray.map((item) => {
          const percentage = total > 0 ? ((item.stateCount / total) * 100).toFixed(1) : 0
          return (
            <Col xs={6} key={item.stateName}>
              <div className="legend-item d-flex align-items-center gap-2">
                <span className="legend-dot" style={{ backgroundColor: getBackgroundColorByState(item.stateName) }} />
                <div>
                  <div className="fw-semibold">{item.stateName}</div>
                  <div className="text-muted small">{item.stateCount} viajes ({percentage}%)</div>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    </DashboardCardShell>
  )
}

const stateColorMap = {
  Finalizado: '#198754',
  'En curso': '#ffc107',
  'Cancelado/Suspendido': '#dc3545',
  Programado: '#0dcaf0',
  Pendiente: '#212529',
  'Viaje no aceptado': '#dc3545',
  Rechazado: '#dc3545',
  'Sin Estado': '#6c757d'
};

const getBackgroundColorByState = (state) => {
  return stateColorMap[state] || '#6c757d';
}

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const percentage = total > 0 ? ((data.stateCount / total) * 100).toFixed(1) : 0

    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: '10px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{data.stateName}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Cantidad: {data.stateCount}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Porcentaje: {percentage}%</p>
      </div>
    )
  }

  return null
} 
