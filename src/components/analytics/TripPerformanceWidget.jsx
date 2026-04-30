import { Card, Row, Col } from 'react-bootstrap'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTripPerformanceStats } from '../../hooks/analytics/useTripPerformanceStats.js'
import { useEffect } from 'react'
import { useState } from 'react'
import DashboardCardShell from '../dashboard/DashboardCardShell.jsx'

export default function TripPerformanceWidget() {

  const [formatedData, setFormatedData] = useState([])
  const {
      data = [],
      isLoading,
      isError,
      error,
    } = useTripPerformanceStats()
  useEffect(() => {
    if(data.length !== 0 && !isLoading && !isError) {
      const total = data[0].withoutObs + data[0].withObs
      setFormatedData([
        { name: 'Viajes Exitosos', value: (data[0].withoutObs / total) * 100, fill: '#198754', totalTrips: data[0].withoutObs },
        { name: 'Con Incidencias', value: (data[0].withObs / total) * 100, fill: '#ffc107', totalTrips: data[0].withObs },
      ])
    }
  }, [data, isError, isLoading])

  return (

    <DashboardCardShell
      title="Rendimiento de viajes"
      subtitle="Comparación de viajes exitosos vs con incidencias"
      badge={formatedData.length ? `Total: ${data[0].withoutObs + data[0].withObs}` : 'Total: 0 viajes'}
      loading={isLoading}
      error={isError ? error : null}
      fallback={formatedData.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de rendimiento de viajes disponibles.</div>
      ) : null}>
        <div className="widget-chart">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formatedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {formatedData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />

            </PieChart>
          </ResponsiveContainer>
        </div>

        <Row className="mt-3 gx-2 gy-2">
          {formatedData.map((item) => (
            <Col xs={6} key={item.name}>
              <div className="legend-item d-flex align-items-center gap-2">
                <span className="legend-dot" style={{ backgroundColor: item.fill }} />
                <div>
                  <div className="fw-semibold">{item.name}</div>
                  <div className="text-muted small">{item.value}%</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

    </DashboardCardShell>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "10px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0 }}>
          Porcentaje: {Number(data.value).toFixed(2)}%
        </p>
        <p style={{ margin: 0 }}>
          Viajes: {data.totalTrips}
        </p>
      </div>
    );
  }

  return null;
};