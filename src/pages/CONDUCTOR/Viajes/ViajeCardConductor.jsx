import { EstadoBadge } from '../../../components/viaje/EstadoBadge'

// Componente que muestra un viaje en formato tarjeta
export function ViajeCardConductor({ viaje, onViewDetails }) {
  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha'
    // Ajuste de zona horaria (+3 horas)
    return new Date(new Date(dateString).getTime() + 3 * 60 * 60 * 1000)
      .toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
  }

  return (
    <div className='card shadow-sm hover-shadow' style={{ transition: 'all 0.2s' }}>
      <div className='card-body'>
        <div className='row align-items-center'>
          {/* Columna izquierda: información del viaje */}
          <div className='col-md-8'>
            {/* Header con ID y estado */}
            <div className='d-flex align-items-center mb-2'>
              <h5 className='card-title mb-0 me-3'>
                Viaje #{viaje.id}
              </h5>
              <EstadoBadge viaje={viaje} variant='card' />
            </div>

            {/* Detalles del viaje en dos columnas */}
            <div className='row mt-3'>
              <div className='col-sm-6'>
                <p className='mb-2'>
                  <strong>🚂 Tren:</strong> {viaje.tren?.modelo || 'No asignado'}
                  {viaje.tren?.color && <span> ({viaje.tren.color})</span>}
                </p>
                <p className='mb-2'>
                  <strong>📍 Recorrido:</strong>{' '}
                  {viaje.recorrido
                    ? `${viaje.recorrido.ciudadSalida} → ${viaje.recorrido.ciudadLlegada}`
                    : 'No asignado'}
                </p>
              </div>
              <div className='col-sm-6'>
                <p className='mb-2'>
                  <strong>📅 Salida:</strong> {formatDate(viaje.fechaIni)}
                </p>
                <p className='mb-2'>
                  <strong>🏁 Llegada:</strong> {formatDate(viaje.fechaFin)}
                </p>
              </div>
            </div>

            {/* Badge de cargas si existen */}
            {viaje.lineasCarga?.length > 0 && (
              <div className='mt-2'>
                <strong>📦 Cargas:</strong>{' '}
                <span className='badge bg-info me-1'>
                  {viaje.lineasCarga.length} línea(s)
                </span>
              </div>
            )}

            {/* Badge de observaciones si existen */}
            {viaje.observaciones?.length > 0 && (
              <div className='mt-1'>
                <strong>📝 Observaciones:</strong>{' '}
                <span className='badge bg-warning'>
                  {viaje.observaciones.length}
                </span>
              </div>
            )}
          </div>

          {/* Columna derecha: botón de acción */}
          <div className='col-md-4 d-flex justify-content-md-end mt-3 mt-md-0'>
            <button
              className='btn btn-outline-primary'
              onClick={onViewDetails}
            >
              <span className='me-1'>🔍</span>
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
