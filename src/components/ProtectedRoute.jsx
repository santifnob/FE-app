import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthQuery } from '../hooks/useAuthQuery.js'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ConductorLayout from './layouts/ConductorLayout.jsx'

export function ProtectedRoute ({ allowedRoles }) {
  const location = useLocation()
  const { data, isLoading, isError } = useAuthQuery(location)
  const { logout, setUser } = useContext(AuthContext)

  useEffect(() => {
    const verificarAuth = async () => {
      if (isError) {
        await logout()
        setUser(null)
      }
    }
    verificarAuth()
  }, [isError])

  if (isLoading) return <p className='text-center'>Cargando...</p>

  // Si no está autorizado
  if (isError || !allowedRoles.includes(data.role)) {
    if (isError) return <Navigate to='/' />

    if (data.role === 'admin') return <Navigate to='/admin/dashboard' />
    if (data.role === 'conductor') return <Navigate to='/conductor/dashboard' />
  }

  // Layout según rol
  if (data.role === 'admin') {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    )
  }

  if (data.role === 'conductor') {
    return (

      <ConductorLayout>
        <Outlet />
      </ConductorLayout>

    )
  }

  // Si por algún motivo no coincide con ningún rol
  return <Navigate to='/' />
}
