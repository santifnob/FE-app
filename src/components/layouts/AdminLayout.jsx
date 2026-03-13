import { useState, useContext } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './AdminLayout.css'

export default function AdminLayout () {
  const [isGestionOpen, setIsGestionOpen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const { logout, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/')
  }

  return (
    <div className='app-root d-flex'>
      {/* SIDEBAR */}
      <aside className={`sidebar ${showSidebar ? 'open' : 'closed'}`}>
        <div className='sidebar-top'>
          <h1 className='mb-4 text-center text-white'>Mi ferrocarril</h1>
          
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
                <Link className='nav-link text-white' to='/admin/dashboard'>📊 Panel de control</Link>
              </li>

              <li className='nav-item text-start h4'>
                <a
                  className='nav-link text-white'
                  onClick={() => setIsGestionOpen(!isGestionOpen)}
                  role='button'
                >
                  📁 Gestión {isGestionOpen ? '▲' : '▼'}
                </a>

                {isGestionOpen && (
                  <ul className='list-unstyled ms-3 w-100 h5'>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/trenes'>🚂Trenes</Link></li>
                    <li><Link className="nav-link text-white mt-2 text-center" to="/admin/estadoTrenes">🛤️Estado Trenes</Link></li>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/conductores'>👨‍✈️Conductores</Link></li>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/licencias'>📃Licencias</Link></li>
                    <li><Link className="nav-link text-white mt-2 text-center" to="/admin/observaciones">🕵Observaciones</Link></li>
                    <li><Link className="nav-link text-white mt-2 text-center" to="/admin/categoriaDenuncias">⚖Categoria de Denuncias</Link></li>                    
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/cargas'>🔋Cargas</Link></li>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/tipoCargas'>💙Tipo Cargas</Link></li>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/recorridos'>🗺️Recorridos</Link></li>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/admin/lineaCargas'>📍Líneas de cargas</Link></li>
                  </ul>
                )}
              </li>
              <li className='nav-item my-4 h4'>
                <Link className='nav-link text-white' to='/admin/viajes'>🚆 Viajes</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='sidebar-bottom'>
          <button className='btn btn-outline-info w-100 mb-2' onClick={() => setShowSidebar(false)}>Cerrar Sidebar</button>
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
