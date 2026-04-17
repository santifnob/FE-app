import InfiniteScroll from 'react-infinite-scroll-component'
export function LicenciaList({ licencias, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {

  const EstadoBadge = ({ estado }) => {
    let estadoTexto = 'Sin estado'

    if (estado === 'Activo') {
      estadoTexto = 'Activo'
    } else if (estado === 'Inactivo') {
      estadoTexto = 'Inactivo'
    }

    const map = {
      Activo: 'success',
      Inactivo: 'danger',
      'Sin estado': 'secondary'
    }

    const variant = map[estadoTexto]

    return (
      <span
        className={`btn btn-sm bg-${variant} text-white me-2`} style={{
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
  return (
    <InfiniteScroll
      dataLength={licencias.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más licencias...</h4>}
      endMessage={<p className='text-center'>No hay más licencias</p>}
      scrollThreshold={0.8}
      scrollableTarget='scrollableDiv'
    >
      
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span></td>
              <td className='text-center'>Conductor</td>
              <td className='text-center'>Fecha de hecho</td>
              <td className='text-center'>Fecha de vencimiento</td>
              <td className='text-center'>Estado</td>

              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {licencias
              .filter(licencia => licencia) // <-- elimina undefined
              .map((licencia) => {
                return (
                  <tr key={licencia.id}>
                    <td className='border-dark' style={{ borderRightWidth: 1 }}>{licencia.id}</td>
                    <td className='text-center'>{licencia.conductor.nombre ? licencia.conductor.nombre : 'Sin nombre'} {licencia.conductor.apellido ? licencia.conductor.apellido : 'Sin apellido'}</td>
                    <td className='text-center'>{licencia.fechaHecho ? new Date(new Date(licencia.fechaHecho).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                    <td className='text-center'>{licencia.fechaVencimiento ? new Date(new Date(licencia.fechaVencimiento).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={licencia.estado} />
                    </td>
                    <td className='text-end'>
                      <div className='d-flex justify-content-end align-items-center gap-2'>
                        <button style={{ marginTop: '-10px' }} className='btn btn-sm btn-info text-white' onClick={handleEdit.bind(this, licencia)}>
                          Editar
                        </button>
                        <button style={{ marginTop: '-10px' }} className='btn btn-sm btn-danger' onClick={async () => deleteMutation(licencia.id)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

          </tbody>
        </table>
      </div>
    </InfiniteScroll>
  )
}
