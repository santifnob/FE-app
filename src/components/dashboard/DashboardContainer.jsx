import { Container } from 'react-bootstrap'
import FleetStatusWidget from '../analytics/FleetStatusWidget.jsx'
import TripPerformanceWidget from '../analytics/TripPerformanceWidget.jsx'
import LicenseAlertsWidget from '../analytics/LicenseAlertsWidget.jsx'
import { QuickActionsWidget } from '../analytics/QuickActionsWidget.jsx'
import { RouteProfitabilityWidget } from '../analytics/RouteProfitabilityWidget.jsx'
import { UpcomingTripsWidget } from '../analytics/UpcomingTripsWidget.jsx'
import './Dashboard.css'

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
        <FleetStatusWidget/>
        <TripPerformanceWidget/>
        <LicenseAlertsWidget/>
        <QuickActionsWidget/>
        <RouteProfitabilityWidget/>
        <UpcomingTripsWidget/>
      </div>
    </Container>
  )
}
