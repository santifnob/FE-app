import { Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import FleetStatusWidget from '../analytics/FleetStatusWidget.jsx'
import TripPerformanceWidget from '../analytics/TripPerformanceWidget.jsx'
import LicenseAlertsWidget from '../analytics/LicenseAlertsWidget.jsx'
import { QuickActionsWidget } from '../analytics/QuickActionsWidget.jsx'
import { RouteProfitabilityWidget } from '../analytics/RouteProfitabilityWidget.jsx'
import { UpcomingTripsWidget } from '../analytics/UpcomingTripsWidget.jsx'
import './Dashboard.css'
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import { ConductorGetOne } from "../../hooks/conductor/useConductorQuery.js";

export default function DashboardContainerConductor() {
  const navigate = useNavigate();

  const { user: currentUser, isLoading: isAuthLoading } = useCurrentUser();

  const {
      data: user,
      isLoading,
      isError,
      error,
    } = ConductorGetOne(currentUser?.id);
  
    const initials = `${user?.nombre?.[0] || ""}${
    user?.apellido?.[0] || ""
  }`.toUpperCase();

  return (
    <Container fluid className="dashboard-page py-4">
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
        <span className="user-name me-2">{user?.nombre} {user?.apellido}</span>
        <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
          {initials}
        </div>
      </Link>
      
      <div className="dashboard-intro mb-4">
        <p className="text-uppercase text-secondary small mb-1">Panel de Control</p>
        <h1 className="dashboard-title mb-2">Dashboard conductor</h1>
        <p className="text-muted mb-0">
          Visualiza tus metricas personales, próximos viajes y alertas importantes
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
