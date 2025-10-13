import InfiniteScroll from 'react-infinite-scroll-component'

export function ObservacionList ({ observaciones, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  const EstadoBadge = ({ estado }) => {
    let estadoTexto = 'Sin estado';

    if (estado === 'Activo') {
      estadoTexto = 'Activo';
    } else if (estado === 'Inactivo') {
      estadoTexto = 'Inactivo';
    }

    const map = {
      'Activo': 'success',
      'Inactivo': 'danger',
      'Sin estado': 'secondary',
    };

    const variant = map[estadoTexto];

    return (
      <span className={`btn btn-sm bg-${variant} text-white me-2`} style={{ pointerEvents: 'none', marginTop: '-10px',
        minWidth: '180px',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: '2.5',
        
 }}>
        {estadoTexto}
      </span>
    );
  };
  return (

    <InfiniteScroll
      dataLength={observaciones.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más observaciones...</h4>}
      endMessage={<p className='text-center'>No hay más observaciones</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span></td>
              <td className='text-center'>Viaje</td>
              <td className='text-center'>Categoria</td>
              <td className='text-center'>Observaciones</td>
              <td className='text-center'>Estado</td>

              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {observaciones.map((observacion) => {
              return (
                <tr key={observacion.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{observacion.id}</td>
                  <td className='text-center'>{observacion.viaje.id?observacion.viaje.id:'Sin id'}-{observacion.viaje.recorrido.ciudadSalida?observacion.viaje.recorrido.ciudadSalida:'Sin ciudad de salida'}/{observacion.viaje.recorrido.ciudadLlegada?observacion.viaje.recorrido.ciudadLlegada:'Sin ciudad de llegada'} ({observacion.viaje.fechaIni? new Date(new Date(observacion.viaje.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'})</td>
                  <td className='text-center'>{observacion.categoriaDenuncia.titulo && observacion.categoriaDenuncia.estado=='Activo'?observacion.categoriaDenuncia.titulo:'Sin categoria'}</td>
                  <td className='text-center'>{observacion.observaciones?observacion.observaciones:'Sin observaciones'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={observacion.estado} />
                    </td>
                  <td className='text-end'>
                    <button style={{ marginTop: '-10px'}}
                      className='btn btn-sm bg-info text-white me-2'
                      onClick={handleEdit.bind(this, observacion)}
                    >
                      Editar
                    </button>
                    <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(observacion.id)}>
                      Eliminar
                    </button>
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
