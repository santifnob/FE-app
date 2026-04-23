import { Card, Row, Col } from 'react-bootstrap'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function FleetStatusWidget({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="widget-header">
          <div>
            <Card.Title className="mb-1">Estado de la flota</Card.Title>
            <Card.Subtitle className="text-muted">Distribución de trenes por estado operativo</Card.Subtitle>
          </div>
          <div className="widget-badge">Total: {total}</div>
        </div>

        <div className="widget-chart">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                cornerRadius={10}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Trenes']} />
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
                  <div className="text-muted small">{item.value} trenes</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  )
}
