import InfiniteScroll from 'react-infinite-scroll-component'

export function LineaCargaList ({ lineaCargas, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
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
      dataLength={lineaCargas.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más linea de cargas...</h4>}
      endMessage={<p className='text-center'>No hay más linea de cargas</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span></td>
              <td className='text-center'>Viaje</td>
              <td className='text-center'>Carga</td>
              <td className='text-center'>Cantidad de vagones</td>
              <td className='text-center'>Estado</td>

              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>            
            {Array.isArray(lineaCargas) && lineaCargas
              .filter(item => item !== undefined && item !== null)
              .map((lineaCarga, index) => {
                return (

                <tr key={index}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{lineaCarga.id}</td>
                  <td className='text-center'>{lineaCarga.viaje.id?lineaCarga.viaje.id:'Sin id'}-{lineaCarga.viaje.recorrido.ciudadSalida?lineaCarga.viaje.recorrido.ciudadSalida:'Sin ciudad de salida'}/{lineaCarga.viaje.recorrido.ciudadLlegada?lineaCarga.viaje.recorrido.ciudadLlegada:'Sin ciudad de llegada'} ({lineaCarga.viaje.fechaIni? new Date(new Date(lineaCarga.viaje.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'})</td>
                  <td className='text-center'>{lineaCarga.carga.name && lineaCarga.carga.estado=='Activo'?lineaCarga.carga.name:'Sin carga'}</td>
                  <td className='text-center'>{lineaCarga.cantidadVagon?lineaCarga.cantidadVagon:'Sin cantidad de vagones'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={lineaCarga.estado} />
                    </td>
                  <td className='text-end'>
                    <button style={{ marginTop: '-10px'}}
                      className='btn btn-sm bg-info text-white me-2'
                      onClick={handleEdit.bind(this, lineaCarga)}
                    >
                      Editar
                    </button>
                    <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(lineaCarga.id)}>
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
