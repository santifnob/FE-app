import { Container } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import FleetStatusWidget from '../analytics/admin/FleetStatusWidget.jsx'
import TripPerformanceWidget from '../analytics/admin/TripPerformanceWidget.jsx'
import LicenseAlertsWidget from '../analytics/admin/LicenseAlertsWidget.jsx'
import { QuickActionsWidget } from '../analytics/admin/QuickActionsWidget.jsx'
import { RouteProfitabilityWidget } from '../analytics/admin/RouteProfitabilityWidget.jsx'
import { UpcomingTripsWidget } from '../analytics/admin/UpcomingTripsWidget.jsx'
import { CargoDistributionWidget } from '../analytics/admin/CargoDistributionWidget.jsx'
import { CancellationRiskWidget } from '../analytics/admin/CancellationRiskWidget.jsx'
import './Dashboard.css'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import { ConductorGetOne } from '../../hooks/conductor/useConductorQuery.js'
import ConductorEarningsWidget from '../analytics/conductor/EarningsWidget.jsx'
import ConductorKilometersWidget from '../analytics/conductor/KilometersTravelledWidget.jsx'
import ConductorLastLicenseWidget from '../analytics/conductor/LastLicenseWidget.jsx'
import ConductorNextTripWidget from '../analytics/conductor/NextTripWidget.jsx'
import ConductorTripChartWidget from '../analytics/conductor/TripChartWidget.jsx'

export default function DashboardContainer() {
  const { user: currentUser, isLoading: isLoadingAuth, isError: isErrorAuth } = useCurrentUser()
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'admin'

  const { data: conductorData } = ConductorGetOne(currentUser?.id)

  const initials = conductorData ? `${conductorData.nombre?.[0] || ""}${
    conductorData.apellido?.[0] || ""
  }`.toUpperCase() : ""


  if (isLoadingAuth) {
    return
  }
  if(isErrorAuth){
    return <h1 className='text-center'>Error al cargar el usuario</h1>
  }
  return (
    <Container fluid className="dashboard-page py-4">
      <div className="dashboard-intro mb-4">
        {!isAdmin && (
            <Link
          to="/conductor/perfil"
          onClick={(e) => {
            e.preventDefault();
            navigate('/conductor/perfil');
          }}
          className="user-info position-fixed d-flex align-items-center"
          style={{
            top: '20px',
            right: '20px',
            zIndex: 1000,
            cursor: 'pointer',
            textDecoration: 'none',
            backgroundColor: 'white',
            padding: '10px 15px',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          >
            <span className="user-name me-2">{conductorData?.nombre} {conductorData?.apellido}</span>
            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              {initials}
            </div>
          </Link>
        )}
        
        <p className="text-uppercase text-secondary small mb-1">Panel de Control</p>
        <h1 className="dashboard-title mb-2">Dashboard {isAdmin ? "Administrativo" : "Usuario"}</h1>
        {isAdmin && (
          <p className="text-muted mb-0">
          Visualiza y gestiona los viajes, la salud de la flota y alertas importantes.
          </p>
        )}
        {!isAdmin && (
          <p className="text-muted mb-0">
            Visualiza tus metricas personales, próximos viajes y alertas importantes
          </p>
        )}

      </div>
      
      {isAdmin && (
        <div className="dashboard-grid">
          <QuickActionsWidget/>
          <FleetStatusWidget/>
          <TripPerformanceWidget/>
          <LicenseAlertsWidget/>
          <RouteProfitabilityWidget/>
          <UpcomingTripsWidget/>
          <CargoDistributionWidget/>
          <CancellationRiskWidget/>
        </div>
        )}

      {!isAdmin && (
        <div className="dashboard-grid">
          <ConductorNextTripWidget/>
          <ConductorEarningsWidget/>
          <ConductorTripChartWidget/>
          <ConductorLastLicenseWidget/>
          <ConductorKilometersWidget/>
          
        </div> 
      )}
    </Container>
  )
}
