import React, { useMemo, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  ProgressBar,
  Button,
  Form,
  ButtonGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Utilidad: formatea fecha a formato local (DD/MM/AAAA) en español.
 * Sugerencia: si tus fechas vienen con 'Z' (UTC), usar timeZone: 'UTC' evita
 * corrimientos de día por zona horaria.
 */
const toLocalDate = (value, locale = 'es-AR', forceUTC = true) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  const opts = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return d.toLocaleDateString(locale, forceUTC ? { ...opts, timeZone: 'UTC' } : opts);
};

/** Etiqueta visual por estado de viaje */
const EstadoBadge = ({ estado }) => {
  const map = {
    'A tiempo': 'success',
    'Con retraso': 'warning',
    Cancelado: 'danger',
    Programado: 'info',
  };
  const variant = map[estado] || 'secondary';
  return <Badge bg={variant}>{estado}</Badge>;
};

/** Tarjeta de KPI reutilizable */
const KpiCard = ({ title, value, subtitle, progress, progressVariant = 'info' }) => (
  <Card className="h-100 shadow-sm">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="text-muted small">{title}</div>
          <div className="fs-3 fw-semibold">{value}</div>
          {subtitle && <div className="text-muted small mt-1">{subtitle}</div>}
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3">
          <ProgressBar now={progress} variant={progressVariant} label={`${progress}%`} />
        </div>
      )}
    </Card.Body>
  </Card>
);

/** Datos mock para demo (reemplazá con tu fetch/API) */
const MOCK = {
  kpis: {
    viajesHoy: 128,
    viajesMes: 3045,
    puntualidad: 92, // %
    ocupacionPromedio: 78, // %
    ingresosMes: 184500000, // ARS
    retrasoPromedioMin: 6, // minutos
  },
  viajes: [
    { id: 10021, origen: 'Rosario', destino: 'Cañada de Gomez', salida: '2025-09-26T08:10:00Z', estado: 'A tiempo', ocupacion: 74 },
    { id: 10022, origen: 'Chavas', destino: 'Venado Tuerto', salida: '2025-09-26T08:30:00Z', estado: 'Con retraso', ocupacion: 88 },
    { id: 10023, origen: 'Funes', destino: 'Galvez', salida: '2025-09-26T08:45:00Z', estado: 'A tiempo', ocupacion: 66 },
    { id: 10024, origen: 'Rosario', destino: 'José C. Paz', salida: '2025-09-26T09:05:00Z', estado: 'Cancelado', ocupacion: 0 },
    { id: 10025, origen: 'Rosario', destino: 'Cañada de Gomez', salida: '2025-09-27T10:15:00Z', estado: 'Programado', ocupacion: 0 },
  ],
  conductoresPendientes: [
    { id: 1, nombre: 'Lucas Cossia', licencia: 'CND-4812', enviado: '2025-09-25T12:00:00Z' },
    { id: 2, nombre: 'Mauro Perez', licencia: 'CND-5120', enviado: '2025-09-26T09:30:00Z' },
  ],
  alertas: [
    { id: 'a1', nivel: 'warning', tipo: 'Mantenimiento', mensaje: 'Chequeo preventivo pendiente en U-342' },
    { id: 'a2', nivel: 'danger', tipo: 'Incidente', mensaje: 'Retraso por hinchas de Newell\'s en estación Rosario Norte' },
  ],
};

const currencyARS = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export default function DashboardTrenes() {
  // Filtros
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [estado, setEstado] = useState('todos');
  const [q, setQ] = useState('');

  // En un caso real, obtendrías esto desde tu API con useEffect + fetch/axios
  const kpis = MOCK.kpis;
  const viajes = MOCK.viajes;
  const conductoresPendientes = MOCK.conductoresPendientes;
  const alertas = MOCK.alertas;

  const viajesFiltrados = useMemo(() => {
    return viajes.filter((v) => {
      const fecha = new Date(v.salida);
      const passDesde = desde ? fecha >= new Date(desde) : true;
      const passHasta = hasta ? fecha <= new Date(hasta + 'T23:59:59') : true;
      const passEstado = estado === 'todos' ? true : v.estado === estado;
      const passQ =
        q.trim() === ''
          ? true
          : [v.origen, v.destino, String(v.id)].some((x) => x.toLowerCase().includes(q.toLowerCase()));
      return passDesde && passHasta && passEstado && passQ;
    });
  }, [viajes, desde, hasta, estado, q]);

  const handleClearFilters = () => {
    setDesde('');
    setHasta('');
    setEstado('todos');
    setQ('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Origen', 'Destino', 'Salida', 'Estado', 'Ocupación %'];
    const rows = viajesFiltrados.map((v) => [
      v.id,
      v.origen,
      v.destino,
      toLocalDate(v.salida),
      v.estado,
      v.ocupacion,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? '');
            return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(';'),
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viajes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container fluid className="py-3">
      {/* Encabezado */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 className="mb-0">Panel de control — Administración de viajes</h2>
          <div className="text-muted">Monitoreo en tiempo real y métricas de la operación</div>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button><Link className='nav-link text-white' to='/admin/viajes'>Crear Viaje</Link></Button>
          <Button variant="outline-secondary" onClick={handleExportCSV}>
            Exportar CSV
          </Button>
        </Col>
      </Row>

      {/* KPIs */}
      <Row className="g-3">
        <Col md={6} lg={3}>
          <KpiCard title="Viajes hoy" value={kpis.viajesHoy} subtitle={`Este mes: ${kpis.viajesMes}`} />
        </Col>
        <Col md={6} lg={3}>
          <KpiCard
            title="Puntualidad"
            value={`${kpis.puntualidad}%`}
            subtitle={`Retraso prom.: ${kpis.retrasoPromedioMin} min`}
            progress={kpis.puntualidad}
            progressVariant="success"
          />
        </Col>
        <Col md={6} lg={3}>
          <KpiCard
            title="Ocupación promedio"
            value={`${kpis.ocupacionPromedio}%`}
            subtitle="Últimos 7 días"
            progress={kpis.ocupacionPromedio}
            progressVariant="info"
          />
        </Col>
        <Col md={6} lg={3}>
          <KpiCard title="Ingresos del mes" value={currencyARS(kpis.ingresosMes)} subtitle="Bruto estimado" />
        </Col>
      </Row>

      {/* Filtros */}
      <Card className="mt-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col sm={6} md={3}>
              <Form.Label>Desde</Form.Label>
              <Form.Control type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </Col>
            <Col sm={6} md={3}>
              <Form.Label>Hasta</Form.Label>
              <Form.Control type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </Col>
            <Col sm={6} md={3}>
              <Form.Label>Estado</Form.Label>
              <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="Programado">Programado</option>
                <option value="A tiempo">A tiempo</option>
                <option value="Con retraso">Con retraso</option>
                <option value="Cancelado">Cancelado</option>
              </Form.Select>
            </Col>
            <Col sm={6} md={3}>
              <Form.Label>Búsqueda</Form.Label>
              <Form.Control
                type="search"
                placeholder="ID, origen o destino"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </Col>
            <Col xs="12" className="d-flex justify-content-end gap-2">
              <ButtonGroup>
                <Button variant="secondary" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
                <Button variant="outline-secondary" onClick={handleExportCSV}>
                  Exportar CSV filtrado
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mt-4 g-4">
        {/* Viajes recientes */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="fw-semibold">Viajes recientes</Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Origen</th>
                      <th>Destino</th>
                      <th>Salida</th>
                      <th>Estado</th>
                      <th>Ocupación</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viajesFiltrados.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">
                          No hay viajes que coincidan con los filtros
                        </td>
                      </tr>
                    )}
                    {viajesFiltrados.map((v) => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>{v.origen}</td>
                        <td>{v.destino}</td>
                        <td>{toLocalDate(v.salida)}</td>
                        <td>
                          <EstadoBadge estado={v.estado} />
                        </td>
                        <td style={{ minWidth: 150 }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="text-muted small" style={{ width: 38 }}>
                              {v.ocupacion}%
                            </div>
                            <ProgressBar
                              now={v.ocupacion}
                              variant={v.ocupacion >= 85 ? 'danger' : v.ocupacion >= 70 ? 'warning' : 'success'}
                              className="flex-grow-1"
                              style={{ height: 8 }}
                            />
                          </div>
                        </td>
                        <td className="text-end">
                          <Button size="sm" variant="outline-primary" className="me-2">
                            Ver
                          </Button>
                          <Button size="sm" variant="outline-secondary" className="me-2">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline-danger">Cancelar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Lado derecho: Conductores y Alertas */}
        <Col lg={4} className="d-flex flex-column gap-4">
          <Card>
            <Card.Header className="fw-semibold">Conductores — pendientes de aprobación</Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Licencia</th>
                    <th>Solicitud</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {conductoresPendientes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        No hay solicitudes pendientes
                      </td>
                    </tr>
                  )}
                  {conductoresPendientes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td><Badge bg="secondary">{c.licencia}</Badge></td>
                      <td>{toLocalDate(c.enviado)}</td>
                      <td className="text-end">
                        <Button size="sm" variant="success" className="me-2">
                          Aprobar
                        </Button>
                        <Button size="sm" variant="outline-danger">Rechazar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="text-muted small">Total pendientes: {conductoresPendientes.length}</Card.Footer>
          </Card>

          <Card>
            <Card.Header className="fw-semibold">Alertas del sistema</Card.Header>
            <Card.Body>
              {alertas.length === 0 && <div className="text-muted">Sin alertas</div>}
              <div className="d-flex flex-column gap-3">
                {alertas.map((a) => (
                  <div key={a.id} className="d-flex align-items-start gap-2">
                    <Badge bg={a.nivel === 'danger' ? 'danger' : 'warning'} className="mt-1">
                      {a.tipo}
                    </Badge>
                    <div className={a.nivel === 'danger' ? 'text-danger' : ''}>{a.mensaje}</div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
