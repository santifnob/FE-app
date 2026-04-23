import { Card, Row, Col } from 'react-bootstrap'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function TripPerformanceWidget({ data }) {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="widget-header">
          <div>
            <Card.Title className="mb-1">Rendimiento de viajes</Card.Title>
            <Card.Subtitle className="text-muted">Comparación de viajes exitosos vs con incidencias</Card.Subtitle>
          </div>
          <div className="widget-badge">Último ciclo</div>
        </div>

        <div className="widget-chart">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <Row className="mt-3 gx-2 gy-2">
          {data.map((item) => (
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
      </Card.Body>
    </Card>
  )
}
