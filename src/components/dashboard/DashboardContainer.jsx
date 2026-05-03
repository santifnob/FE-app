import { Container } from 'react-bootstrap'
import FleetStatusWidget from '../analytics/admin/FleetStatusWidget.jsx'
import TripPerformanceWidget from '../analytics/admin/TripPerformanceWidget.jsx'
import LicenseAlertsWidget from '../analytics/admin/LicenseAlertsWidget.jsx'
import { QuickActionsWidget } from '../analytics/admin/QuickActionsWidget.jsx'
import { RouteProfitabilityWidget } from '../analytics/admin/RouteProfitabilityWidget.jsx'
import { UpcomingTripsWidget } from '../analytics/admin/UpcomingTripsWidget.jsx'
import './Dashboard.css'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'

export default function DashboardContainer() {
  const { user, isLoading, isError } = useCurrentUser()
  console.log(user);
  const isAdmin = user?.role === 'admin'
  if (isLoading) {
    return
  }
  if(isError){
    return <h1 className='text-center'>Error al cargar el usuario</h1>
  }
  return (
    <Container fluid className="dashboard-page py-4">
      <div className="dashboard-intro mb-4">
        <p className="text-uppercase text-secondary small mb-1">Panel de Control</p>
        <h1 className="dashboard-title mb-2">Dashboard {isAdmin ? "Administrativo" : "Usuario"}</h1>
        {isAdmin && (
          <p className="text-muted mb-0">
          Visualiza la salud de la flota, el rendimiento de viajes y alertas de licencias con un layout modular.
          </p>
        )}

      </div>
      {isAdmin && (
        <div className="dashboard-grid">
        <FleetStatusWidget/>
        <TripPerformanceWidget/>
        <LicenseAlertsWidget/>
        <QuickActionsWidget/>
        <RouteProfitabilityWidget/>
        <UpcomingTripsWidget/>
      </div>
        )}
    </Container>
  )
}
