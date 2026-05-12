import { Outlet, Navigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import AdminLayout from './layouts/AdminLayout.jsx'
import ConductorLayout from './layouts/ConductorLayout.jsx'
import { LoadingScreen } from './shared/LoadingScreen.jsx'

export function ProtectedRoute ({ allowedRoles }) {
  const { user, isLoading } = useCurrentUser()
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  
  if (user?.role === 'admin') {
    return (
      <AdminLayout>
        {isLoading ? <LoadingScreen title='Validando sesión...' subtitle='Un momento por favor' /> : <Outlet />}
      </AdminLayout>
    )
  }

  if (user?.role === 'conductor') {
    return (
      <ConductorLayout>
        {isLoading ? <LoadingScreen title='Validando sesión...' subtitle='Un momento por favor' /> : <Outlet />}
      </ConductorLayout>
    )
  }

  if (isLoading) {
    return <LoadingScreen title='Validando sesión...' subtitle='Un momento por favor' />
  }

  if (!user) {
    return <Navigate to='/' />
  }

  if (!roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to='/admin/dashboard' />
    if (user.role === 'conductor') return <Navigate to='/conductor/dashboard' />
    return <Navigate to='/' />
  }


  return <Navigate to='/' />
}
