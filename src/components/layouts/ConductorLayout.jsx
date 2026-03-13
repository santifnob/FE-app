import { useState, useContext } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './AdminLayout.css'

export default function AdminLayout () {
  const [isMisViajesOpen, setisMisViajesOpen] = useState(false)
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
          <h2 className='mb-4 text-center text-white'>Mi ferrocarril</h2>
           
           
          <div className='d-flex justify-content-center mt-1 mb-4'>
            <div
              className='d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill'
              style={{
                backgroundColor: 'rgba(25, 135, 84, 0.14)',
                border: '1px solid rgba(25, 135, 84, 0.35)',
                color: '#d1ffe2',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <span>🧭</span>
              <span>Modo conductor</span>
            </div>
          </div>



          <div className='sidebar-scroll'>
            <ul className='nav flex-column'>
              <li className='nav-item mb-4 h4'>
                <Link className='nav-link text-white' to='/conductor/dashboard'>📊 Panel de control</Link>
              </li>

              <li className='nav-item text-start h4'>
                <a
                  className='nav-link text-white'
                  onClick={() => setisMisViajesOpen(!isMisViajesOpen)}
                  role='button'
                >
                  🚆Mis Viajes {isMisViajesOpen ? '▲' : '▼'}
                </a>

                {isMisViajesOpen && (
                  <ul className='list-unstyled ms-3 w-100 h5'>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/conductor/pendientes'>⚠️ Pendientes</Link></li>
                    <li><Link className="nav-link text-white mt-2 text-center" to="/conductor/enCursos">🧳 En curso</Link></li>
                    <li><Link className='nav-link text-white mt-2 text-center' to='/conductor/finalizados'>✔️ Finalizados</Link></li>
                  </ul>
                )}
              </li>
              <li className='nav-item my-4 h4'>
                <Link className='nav-link text-white' to='/conductor/perfil'>👤 Perfil</Link>
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

