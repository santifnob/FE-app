import { Container } from 'react-bootstrap'
import FleetStatusWidget from './FleetStatusWidget.jsx'
import TripPerformanceWidget from './TripPerformanceWidget.jsx'
import LicenseAlertsWidget from './LicenseAlertsWidget.jsx'
import './Dashboard.css'

const fleetStatusData = [
  { name: 'Disponible', value: 18, fill: '#198754' },
  { name: 'En viaje', value: 12, fill: '#0d6efd' },
  { name: 'En reparación', value: 5, fill: '#dc3545' },
  { name: 'Obsoleto', value: 3, fill: '#6c757d' },
]

const tripPerformanceData = [
  { name: 'Viajes Exitosos', value: 84, fill: '#198754' },
  { name: 'Con Incidencias', value: 16, fill: '#ffc107' },
  { name: 'Cancelados/Suspendidos', value: 5, fill: '#dc3545' },
]

const licenseAlerts = [
  { id: 1, conductor: 'Martín Ruiz', licencia: 'LIC-1234', diasRestantes: 4, vencimiento: '2025-10-03' },
  { id: 2, conductor: 'Agustina Flores', licencia: 'LIC-8532', diasRestantes: 10, vencimiento: '2025-10-09' },
  { id: 3, conductor: 'José Gómez', licencia: 'LIC-3351', diasRestantes: 13, vencimiento: '2025-10-12' },
]

export default function DashboardContainer() {
  return (
    <Container fluid className="dashboard-page py-4">
      <div className="dashboard-intro mb-4">
        <p className="text-uppercase text-secondary small mb-1">Panel de Control</p>
        <h1 className="dashboard-title mb-2">Dashboard administrativo</h1>
        <p className="text-muted mb-0">
          Visualiza la salud de la flota, el rendimiento de viajes y alertas de licencias con un layout modular.
        </p>
      </div>

      <div className="dashboard-grid">
        <FleetStatusWidget data={fleetStatusData} />
        <TripPerformanceWidget data={tripPerformanceData} />
        <LicenseAlertsWidget alerts={licenseAlerts} />
      </div>
    </Container>
  )
}
