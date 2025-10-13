import { Link, useLocation } from 'react-router-dom'

export default function Page404 ({ role }) {
  const location = useLocation()

  // Determinar destino según el rol
  let backLink = '/'
  if (role === 'admin') {
    backLink = '/admin/dashboard'
  } else if (role === 'conductor') {
    backLink = '/conductor/dashboard'
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <p><small>Ruta: {location.pathname}</small></p>
      <Link to={backLink} className='btn btn-primary'>
        Volver
      </Link>
    </div>
  )
}
