import { useState, useContext, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './AdminLayout.css'

export default function AdminLayout () {
  const [showSidebar, setShowSidebar] = useState(true)
  const { logout, setUser } = useContext(AuthContext)
  const location = useLocation();
  const navigate = useNavigate()
  const [isGestionOpen, setIsGestionOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
  if (location.pathname.includes('gestion')) {
    setIsGestionOpen(true)
  }
}, [location.pathname])

  return (
    <div className='app-root d-flex'>
      {/* SIDEBAR */}
      <aside className={`sidebar ${showSidebar ? 'open' : 'closed'}`}>
        <div className='sidebar-top'>
          <h1
            className='mb-4 text-center text-white funnel-display-h1'
            role='button'
            onClick={() => navigate('/admin/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            Mi ferrocarril
          </h1>

          <div className='d-flex justify-content-center mt-1 mb-4'>
            <div
              className='d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill'
              style={{
                backgroundColor: 'rgba(212, 0, 255, 0.51)',
                border: '1px solid rgba(156, 17, 221, 0.35)',
                color: '#d1ffe2',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <span>🧭</span>
              <span>Modo administrador</span>
            </div>
          </div>
          
          <div className='sidebar-scroll'>
            <ul className='nav flex-column'>
              <li className='nav-item mb-4 h4'>
                <Link className={`nav-link text-white ${location.pathname === '/admin/dashboard' ? 'active' : ''}`} to='/admin/dashboard'>
                  📊 Panel de control
                </Link>
              </li>

              <li className='nav-item text-start h4'>
                <a
                  className={`nav-link text-white ${location.pathname.includes('gestion') ? 'active' : ''}`}
                  role='button'
                  onClick={() => setIsGestionOpen(!isGestionOpen)}
                >
                  📁 Gestión <span className={`arrow ${isGestionOpen ? 'rotate' : ''}`}>▼</span>
                </a>

                <ul className={`submenu list-unstyled ms-3 w-100 h5 ${isGestionOpen ? 'open' : ''}`}>
                  <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/trenes' ? 'active' : ''}`} to='/admin/gestion/trenes' >
                      🚂Trenes
                    </Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/estadoTrenes' ? 'active' : ''}`} to='/admin/gestion/estadoTrenes'>
                      🛤️Estado Trenes</Link>
                    </li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/conductores' ? 'active' : ''}`} to='/admin/gestion/conductores'>👨‍✈️Conductores</Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/licencias' ? 'active' : ''}`} to='/admin/gestion/licencias'>📃Licencias</Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/observaciones' ? 'active' : ''}`} to='/admin/gestion/observaciones'>🕵Observaciones</Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/categoriaDenuncias' ? 'active' : ''}`} to='/admin/gestion/categoriaDenuncias'>⚖Categoria de Denuncias</Link></li>                    
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/cargas' ? 'active' : ''}`} to='/admin/gestion/cargas'>🔋Cargas</Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/tipoCargas' ? 'active' : ''}`} to='/admin/gestion/tipoCargas'>💙Tipo Cargas</Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/recorridos' ? 'active' : ''}`} to='/admin/gestion/recorridos'>🗺️Recorridos</Link></li>
                    <li><Link className={`nav-link text-white mt-2 text-center ${location.pathname === '/admin/gestion/lineaCargas' ? 'active' : ''}`} to='/admin/gestion/lineaCargas'>📍Líneas de cargas</Link></li>
                </ul>
                
              </li>
              <li className='nav-item my-4 h4'>
                <Link className={`nav-link text-white ${location.pathname === '/admin/viajes' ? 'active' : ''}`} to='/admin/viajes'>🚆 Viajes</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='sidebar-bottom'>
          <button className='btn btn-outline-info w-100 mb-2' onClick={() => setShowSidebar(false)}>Cerrar Menú</button>
          <button className='btn btn-outline-danger w-100' onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      {!showSidebar && (
        <button className='sidebar-toggle btn btn-primary' onClick={() => setShowSidebar(true)}>☰</button>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main id='scrollableDiv' className='content p-4' style={{ marginLeft: showSidebar ? 300 : 20 }}>
        <Outlet />
      </main>
    </div>
  )
}
