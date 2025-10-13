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
import  DashboardTrenes  from './pages/DashboardTrenes.jsx'
import { ViajeCrud } from './pages/CRUD/ViajeCrud.jsx'
import { ObservacionCrud } from './pages/CRUD/ObservacionCrud.jsx'
import { LineaCargaCrud } from './pages/CRUD/LineaCargaCrud.jsx'

function App () {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>

          <Routes>
            {/* Pagina en construccion */}
            <Route path='/pagina-en-construccion' 
            element={<EnConstruccion />}> 
            </Route>

            {/* Administrador */}
            <Route path='/admin' element={<ProtectedRoute allowedRoles='admin' > </ProtectedRoute>}>
              <Route
                path='dashboard'
                element={<DashboardTrenes/>}
              />

              <Route
                path='tipoCargas'
                element={<TipoCargaCrud />}
              />

              <Route
                path='lineaCargas'
                element={<LineaCargaCrud />}
              />

              <Route
                path='viajes'
                element={<ViajeCrud />}
              />

              <Route
                path='categoriaDenuncias'
                element={<CategoriaDenunciaCrud />}
              />

              <Route
                path='recorridos'
                element={<RecorridoCrud />}
              />

              <Route
                path='estadoTrenes'
                element={<EstadoTrenCrud />}
              />

              <Route
                path='cargas'
                element={<CargaCrud />}
              />

              <Route
                path='conductores'
                element={<ConductorCrud />}
              />

              <Route
                path='observaciones'
                element={<ObservacionCrud/>}
              />

              <Route
                path='perfil'
                element={<EnConstruccionCopy/>}
              />

              <Route
                path='licencias'
                element={<LicenciaCrud />}
              />

              <Route
                path='trenes'
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
                element={<EnConstruccionCopy/>}
              />

              <Route
                path='pendientes'
                element={<EnConstruccionCopy/>}
              />

              <Route
                path='enCursos'
                element={<EnConstruccionCopy/>}
              />

              <Route
                path='finalizados'
                element={<EnConstruccionCopy/>}
              />

              <Route
                path='perfil'
                element={<EnConstruccionCopy/>}
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
