import InfiniteScroll from "react-infinite-scroll-component"

export function EstadoTrenList({ estadoTrenes, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) { 
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
  return(

    <InfiniteScroll
      dataLength={estadoTrenes.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más estados de trenes...</h4>}
      endMessage={<p className='text-center'>No hay más estados de trenes</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Tren</td>
              <td className='text-center'>Vigente desde</td>              
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
              {estadoTrenes.map((estadoTren) => {
                return (
                  <tr key={estadoTren.id}>
                    <td className='border-dark' style={{ borderRightWidth: 1 }}>{estadoTren.id}</td>
                    <td className='text-center'>{estadoTren.nombre ? estadoTren.nombre : 'Sin nombre'}</td>
                    <td className='text-center'>{estadoTren.tren ? estadoTren.tren : 'Sin Tren'}</td>
                    <td className='text-center'>{estadoTren.fechaVigencia ? new Date(new Date(estadoTren.fechaVigencia).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                    <td className='text-center'>{estadoTren.createdAt? new Date(new Date(estadoTren.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={estadoTren.estado} />
                    </td>                    
                    <td className='text-end'>
                      <button style={{ marginTop: '-10px'}}
                        className='btn btn-sm bg-info text-white me-2'
                        onClick={handleEdit.bind(this, estadoTren)}
                      >
                        Editar
                      </button>
                      <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(estadoTren.id)}>
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