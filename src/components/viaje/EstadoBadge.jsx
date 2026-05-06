import { getEstadoInferido } from '../../shared/utils/viajeUtils.js';

export function EstadoBadge({ viaje, variant = 'table' }) {
  // Use the computed status from backend if available, otherwise compute it
  const estadoTexto = viaje.estadoInferido || getEstadoInferido(viaje)

  const map = {
    Finalizado: 'success',
    'En curso': 'warning',
    'Cancelado/Suspendido': 'danger',
    Programado: 'info',
    Pendiente: 'dark',
    'Viaje no aceptado': 'danger',
    Rechazado: 'danger',
    'Sin Estado': 'secondary'
  }

  const color = map[estadoTexto] || 'secondary'

  if (variant === 'card') {
    return (
      <span
        className={`badge bg-${color} text-white`}
        style={{
          fontSize: '0.85rem',
          padding: '0.5rem 0.75rem'
        }}
      >
        {estadoTexto}
      </span>
    )
  }

  return (
    <span
      className={`btn btn-sm bg-${color} text-white me-2`}
      style={{
        pointerEvents: 'none',
        marginTop: '-10px',
        minWidth: '180px',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: '2.5'
      }}
    >
      {estadoTexto}
    </span>
  )
}