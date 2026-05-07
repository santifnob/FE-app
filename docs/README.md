# Documentación del Proyecto - Mi Ferrocarril (FE-app)

Bienvenido a la documentación del frontend del proyecto. Aquí encontrará toda la información necesaria para entender, instalar y ejecutar la aplicación.

## Índice de Contenidos
- [1. Proposal](#1-proposal)
- [2. Links a PR/MR y issues](#2-links-a-prmr-y-issues)
- [3. Instrucciones de instalación](#3-instrucciones-de-instalación)
- [4. Tecnologías utilizadas](#4-tecnologías-utilizadas)
- [5. Documentación de la API](#5-documentación-de-la-api)
- [6. Evidencia de ejecución de tests automáticos](#6-evidencia-de-ejecución-de-tests-automáticos)
- [7. Tracking de features y bugs](#7-tracking-de-features-y-bugs)
- [8. Deploy](#8-deploy)
- [9. Demo de app en video](#9-demo-de-app-en-video)

## 1. Proposal 
- Proposal: [proposal.md](https://github.com/santifnob/tp/blob/main/proposal.md)
- Esta entrega documenta el frontend FE-app y su integración con el backend BE-app.

## 2. Links a PR/MR y issues
- Repositorio frontend: https://github.com/santifnob/FE-app
- Pull requests / merge requests: https://github.com/santifnob/FE-app/pulls

## 3. Instrucciones de instalación
1. Instalar Node.js (versión recomendada 18 o superior).
2. Instalar pnpm globalmente si no está instalado:
   ```bash
   npm install -g pnpm
   ```
3. Clonar el repositorio y posicionarse en la carpeta raíz del proyecto:
   ```bash
   git clone https://github.com/santifnob/FE-app.git
   cd FE-app
   ```
4. Instalar dependencias:
   ```bash
   pnpm install
   ```
5. Configurar la API backend en un archivo `.env` o como variable de entorno:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
6. Levantar la aplicación en modo desarrollo:
   ```bash
   pnpm run dev
   ```
7. Abrir el navegador en `http://localhost:5173` (o la URL que indique Vite).


## 4. Tecnologías utilizadas
El desarrollo del frontend se ha basado en un stack moderno de JavaScript/React, seleccionando herramientas que priorizan el rendimiento, la experiencia de desarrollo y la mantenibilidad del código.

   ### 4.1 Core del proyecto
- **React 19** - biblioteca principal para construir la interfaz de usuario.
- **Vite** - herramienta de desarrollo y bundling rápida para el frontend.
- **pnpm** - manejador de paquetes eficiente para instalar dependencias.

   ### 4.2 Gestión de datos y comunicación
- **Axios** - cliente HTTP para consumir la API del backend.
- **@tanstack/react-query** - manejo de datos remotos, caché y sincronización con la API.

   ### 4.3 Navegación y formularios
- **React Router DOM** - enrutamiento de páginas y rutas dentro del SPA.
- **React Hook Form** - control y validación de formularios de entrada.

   ### 4.4 UI y visualización
- **Bootstrap** y **react-bootstrap** - estilos y componentes UI reutilizables.
- **Recharts** - visualización de datos en gráficos y dashboards.

   ### 4.5 Pruebas y calidad
- **Vitest** - framework de pruebas unitarias para componentes y lógica.
- **Cypress** - pruebas end-to-end para flujos de usuario.
- **ESLint**, **standard**, **@eslint/js** - reglas de estilo y calidad de código.
- **jsdom** - entorno de DOM para pruebas unitarias de componentes React.

## 5. Documentación de la API
### Base URL
- `VITE_API_URL` (por defecto `http://localhost:3000/api`)
(mandar al readme.md del back)

## 6. Evidencia de ejecución de tests automáticos
### Vitest

### Archivo de Test Disponible
- `src/components/estadoTren/EstadoTrenForm.test.jsx` - Test para probar el estadoTren form

### Ejecución de Test
Para ejecutar el test:
- Comando: `pnpm test -- --run`
- Resultado actual: `1 archivo de prueba pasado`, `7 tests pasaron`.
 ✓ src/components/estadoTren/EstadoTrenForm.test.jsx (7 tests) 6ms
   ✓ Test Unitario - EstadoTrenForm (7)
     ✓ El componente EstadoTrenForm debe existir 2ms
     ✓ Debe ser una función (componente de React) 0ms
     ✓ El campo "Trenes" debe ser obligatorio 0ms
     ✓ El campo "Nombre" (estado del tren) debe ser obligatorio 0ms
     ✓ El campo "Fecha de vigencia" debe ser obligatorio 0ms
     ✓ Los estados del tren disponibles deben ser: En reparación, Obsoleto, Disponible 1ms
     ✓ Las opciones de "Estado" deben ser Activo e Inactivo 0ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  13:06:39
   Duration  2.50s (transform 93ms, setup 0ms, import 317ms, tests 6ms, environment 1.98s)

### Cypress

### Archivo de Test E2E Disponible
- `cypress/e2e/create_trip.cy.js` - Test para crear un viaje iniciando seccion como admin

### Ejecución de Test
Para ejecutar el test:
- Comando de ejecución E2E: `pnpm run cypress:run`
- Comando de apertura local: `pnpm run cypress:open`

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.14.2                                                                        │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Node Version:   v22.14.0 (C:\Users\xx\node.exe)                                                                  │
  │ Specs:          1 found (create_trip.cy.js)                                                    │
  │ Searched:       cypress/e2e/**/*.cy.{js,jsx,ts,tsx}                                            │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  create_trip.cy.js                                                               (1 of 1)


  Prueba E2E de Crear Viaje
    √ debería iniciar sesión como admin y crear un nuevo viaje (5608ms)


  1 passing (6s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        1                                                                                │
  │ Passing:      1                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     5 seconds                                                                        │
  │ Spec Ran:     create_trip.cy.js                                                                │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ √  create_trip.cy.js                        00:05        1        1        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    √  All specs passed!                        00:05        1        1        -        -        -  

## 7. Tracking de features y bugs
- Features principales:
  - Gestión de conductores y licencias.
  - Gestión de trenes, estados de tren y viajes.
  - Gestión de cargas, recorridos y líneas de carga.
  - Dashboard analítico con métricas de viaje y conductor.
  - Cards visuales en los listados de entidades para dispositivos moviles
- Bugs y mejoras:
  - Validar rangos de fechas para viajes y licencias.
  - Controlar estado de disponibilidad del tren antes de asignar viajes.
  - Manejar sesiones de usuario y permisos en el frontend.
- Seguimiento en GitHub Issues: https://github.com/santifnob/FE-app/issues

## 8. Deploy

### Descripción del deploy
El frontend FE-app está construido con Vite y React, lo que permite un despliegue rápido y eficiente en plataformas de hosting estáticas o de aplicaciones modernas. El bundle se genera con `pnpm build`, produciendo una carpeta `dist/` lista para servir.

### Tecnologías involucradas en el deploy
- `Vite`: empaqueta y optimiza la aplicación para producción.
- `React`: renderiza la interfaz del usuario en el cliente.
- `pnpm`: administra dependencias y comandos de build.
- `Axios` + `React Query`: consumen la API remota en tiempo de ejecución.
- `Bootstrap` y `React Bootstrap`: proveen la capa de estilo y UI responsive en producción.
- `Recharts`: muestra gráficos de métricas en el dashboard.

### Recomendaciones de hosting
- Plataforma estática: Vercel, Netlify o GitHub Pages.
- Plataforma con soporte de SPA: configurar redirección de rutas a `index.html`.
- Backend requerido: el frontend se conecta a `VITE_API_URL` y necesita un backend activo con los endpoints documentados.

### Comandos de build y preview
```bash
pnpm build
pnpm run preview
```

### Links de acceso
- Mi Ferrocarril: https://www.miferrocarril.app/

### Credenciales de prueba

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Admin | admin@admin.com | admin |
| Conductor | g@email.com | asd |

## 9. Demo de app en video
- Demo pendiente / TBD.
