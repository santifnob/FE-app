import InfiniteScroll from "react-infinite-scroll-component"

export function CargaList({ cargas, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) { 
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
      dataLength={cargas.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más cargas...</h4>}
      endMessage={<p className='text-center'>No hay más cargas</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Precio</td>
              <td className='text-center'>Tipo de carga</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
              {cargas.map((carga) => {
                return (
                  <tr key={carga.id}>
                    <td className='border-dark' style={{ borderRightWidth: 1 }}>{carga.id}</td>
                    <td className='text-center'>{carga.name ? carga.name : 'Sin nombre'}</td>
                    <td className='text-center'>{carga.precio ? carga.precio : 'Sin precio'}</td>                                  
                    <td className='text-center'>{carga.tipoCarga && carga.tipoCarga.estado === 'Activo' ? carga.tipoCarga.name : 'Sin tipo de carga'}</td>
                    <td className='text-center'>{carga.createdAt? new Date(new Date(carga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={carga.estado} />
                    </td>
                    <td className='text-end'>
                      <button style={{ marginTop: '-10px'}}
                        className='btn btn-sm bg-info text-white me-2'
                        onClick={handleEdit.bind(this, carga)}
                      >
                        Editar
                      </button>
                      <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(carga.id)}>
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