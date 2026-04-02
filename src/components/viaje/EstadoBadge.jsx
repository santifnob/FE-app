export function EstadoBadge({ viaje, variant = 'table' }) {
  const getEstadoTexto = (viaje) => {
    const hoy = new Date()
    const fechaIni = new Date(viaje.fechaIni)
    const fechaFin = new Date(viaje.fechaFin)

    if (viaje.estado === 'Inactivo') {
      return 'Cancelado/Suspendido'
    }
    if (viaje.estado === 'Rechazado') {
      return 'Rechazado'
    }
    if (viaje.estado === 'Pendiente') {
      fechaIni > hoy ? 'Pendiente' : 'Viaje no aceptado'
    }

    if (fechaFin < hoy) return 'Finalizado'
    if (fechaIni > hoy) return 'Programado'
    if (fechaIni <= hoy && fechaFin >= hoy) return 'En curso'

    return 'Sin Estado'
  }

  const estadoTexto = getEstadoTexto(viaje)

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