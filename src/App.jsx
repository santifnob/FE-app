import { LoginPage } from './auth/LoginPage.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'
import { BrowserRouter, Router, Routes, Route, Link } from 'react-router-dom'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { EnConstruccion } from './pages/EnConstruccion.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Page404 from './pages/404.jsx'
import { TrenCrud } from './pages/CRUD/TrenCrud.jsx'
import { RecorridoCrud } from './pages/CRUD/RecorridoCrud.jsx'
import { CargaCrud } from './pages/CRUD/CargaCrud.jsx'
import { ConductorCrud } from './pages/CRUD/ConductorCrud.jsx'
import { TipoCargaCrud } from './pages/CRUD/TipoCargaCrud.jsx'
import { LicenciaCrud } from './pages/CRUD/LicenciaCrud.jsx'
import { CategoriaDenunciaCrud } from './pages/CRUD/CategoriaDenunciaCrud.jsx'
import { EnConstruccionCopy } from './pages/EnConstruccion copy.jsx'
import { EstadoTrenCrud } from './pages/CRUD/EstadoTrenCrud.jsx'
import DashboardContainer from './components/dashboard/DashboardContainer.jsx'
import { ViajeCrud } from './pages/CRUD/ViajeCrud.jsx'
import { ObservacionCrud } from './pages/CRUD/ObservacionCrud.jsx'
import { LineaCargaCrud } from './pages/CRUD/LineaCargaCrud.jsx'
import  PerfilConductor  from './pages/CONDUCTOR/PerfilBase.jsx'
import PendientesViajes from './pages/CONDUCTOR/Viajes/PendientesViajes'
import EnCursoViajes from './pages/CONDUCTOR/Viajes/EnCursoViajes'
import FinalizadosViajes from './pages/CONDUCTOR/Viajes/FinalizadosViajes'
import RechazadosViajes from './pages/CONDUCTOR/Viajes/RechazadosViajes.jsx'
import CanceladosViajes from './pages/CONDUCTOR/Viajes/CanceladosViajes.jsx'
import ProgramadosViajes from './pages/CONDUCTOR/Viajes/ProgramadosViajes.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>

          <Routes>
            {/* Pagina en construccion */}
            <Route
              path='/pagina-en-construccion'
              element={<EnConstruccion />}
            />

            {/* Administrador */}
            <Route path='/admin' element={<ProtectedRoute allowedRoles='admin'> </ProtectedRoute>}>

              <Route
                path='dashboard'
                element={<DashboardContainer />}
              />

              <Route
                path='gestion/tipoCargas'
                element={<TipoCargaCrud />}
              />

              <Route
                path='gestion/lineaCargas'
                element={<LineaCargaCrud />}
              />

              <Route
                path='viajes'
                element={<ViajeCrud />}
              />

              <Route
                path='gestion/categoriaDenuncias'
                element={<CategoriaDenunciaCrud />}
              />

              <Route
                path='gestion/recorridos'
                element={<RecorridoCrud />}
              />

              <Route
                path='gestion/estadoTrenes'
                element={<EstadoTrenCrud />}
              />

              <Route
                path='gestion/cargas'
                element={<CargaCrud />}
              />

              <Route
                path='gestion/conductores'
                element={<ConductorCrud />}
              />

              <Route
                path='gestion/observaciones'
                element={<ObservacionCrud />}
              />

              <Route
                path='perfil'
                element={<EnConstruccionCopy />}
              />

              <Route
                path='gestion/licencias'
                element={<LicenciaCrud />}
              />

              <Route
                path='gestion/trenes'
                element={<TrenCrud />}
              />

              {/* 404 protegido para /admin/... */}
              <Route
                path='*'
                element={<Page404 role='admin' />}
              />

            </Route>

            {/* Conductor */}
            <Route
              path='/conductor'
              element={<ProtectedRoute
                allowedRoles='conductor'
              />}
            >

              <Route
                path='dashboard'
                element={<DashboardContainer/>}
              />

              <Route
                path='misViajes/pendientes'
                element={<PendientesViajes />}
              />

              <Route
                path='misViajes/enCursos'
                element={<EnCursoViajes />}
              />

              <Route
                path='misViajes/finalizados'
                element={<FinalizadosViajes />}
              />
              
              <Route
                path='misViajes/programados'
                element={<ProgramadosViajes />}
              />

              <Route
                path='misViajes/rechazados'
                element={<RechazadosViajes />}
              />

              <Route
                path='misViajes/cancelados'
                element={<CanceladosViajes />}
              />

              <Route
                path='perfil'
                element={<PerfilConductor />}
              />

              {/* 404 protegido para /conductor/... */}
              <Route
                path='*'
                element={<Page404 role='conductor' />}
              />
            </Route>

            {/* Inicio y registro */}
            <Route
              path='/'
              element={<LoginPage />}
            />

            <Route
              path='/register'
              element={<RegisterPage />}
            />

            {/* 404 global */}
            <Route
              path='*'
              element={<Page404 role='global' />}
            />

          </Routes>
        </AuthProvider>

      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
