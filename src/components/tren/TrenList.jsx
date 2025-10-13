import InfiniteScroll from "react-infinite-scroll-component"

export function TrenList({ trenes, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) { 

  const EstadoBadgeTren = ({ estado }) => {
    let estadoTexto = 'Sin estado';

    if (estado === 'Disponible') {
      estadoTexto = 'Disponible';
    } else if (estado === 'Obsoleto') {
      estadoTexto = 'Obsoleto';
    } else if (estado === 'En reparacion') {
      estadoTexto = 'En reparación';
    }

    const map = {
      'Disponible': 'success',
      'Obsoleto': 'danger',
      'En reparación': 'warning',
      'Sin estado': 'dark',
    };

    const variant = map[estadoTexto];

    return (
      <span
        className={`btn btn-sm bg-${variant} text-white me-2`}
        style={{
          pointerEvents: 'none',
          marginTop: '-10px',
          minWidth: '180px',
          textAlign: 'center',
          fontWeight: '500',
          lineHeight: '2.5',
        }}
      >
        {estadoTexto}
      </span>
    );
  };

  return(

    <InfiniteScroll
      dataLength={trenes.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más trenes...</h4>}
      endMessage={<p className='text-center'>No hay más trenes</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Modelo</td>
              <td className='text-center'>Color</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado Actual</td>             
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
              {trenes.map((tren) => {
                return (
                  <tr key={tren.id}>
                    <td className='border-dark' style={{ borderRightWidth: 1 }}>{tren.id}</td>
                    <td className='text-center'>{tren.modelo?tren.modelo:'Sin modelo'}</td>
                    <td className='text-center'>{tren.color?tren.color:'Sin color'}</td>
                    <td className='text-center'>{tren.createdAt? new Date(new Date(tren.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                    

                    <td className='text-center'>
                      <EstadoBadgeTren estado={tren.estadoActual?.nombre ?? 'Sin estado'} />
                    </td>




                    <td className='text-end'>
                      <button style={{ marginTop: '-10px'}}
                        className='btn btn-sm bg-info text-white me-2'
                        onClick={handleEdit.bind(this, tren)}
                      >
                        Editar
                      </button>
                      <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(tren.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            
          </tbody>
        </table>
      </div>
    </InfiniteScroll>)
  }