export function CrudActions({
  onEdit,
  onDelete,
  onView,
  showView = false
}) {
  return (

    <div className='d-flex justify-content-end align-items-center gap-2'>
      {showView && (
        <button style={{ marginTop: '-10px' }} className='btn btn-outline-primary btn-sm' onClick={onView}>
          Ver detalles
        </button>
      )}

      <button
        style={{ marginTop: '-10px' }}
        className='btn btn-sm btn-info text-white'
        onClick={onEdit}
      >
        Editar
      </button>

      <button
        style={{ marginTop: '-10px' }}
        className='btn btn-sm btn-danger'
        onClick={onDelete}
      >
        Eliminar
      </button>
    </div>
  )
}
