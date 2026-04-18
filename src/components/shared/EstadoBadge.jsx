export function EstadoBadge({
  estadoTexto,
  variant = 'table'
}) {
    const estadoColorMap = {
    Activo: 'success',
    Inactivo: 'danger',
    'Sin estado': 'secondary'
    }
    const color = estadoColorMap[estadoTexto] || 'secondary'

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
