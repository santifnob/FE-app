import InfiniteScroll from "react-infinite-scroll-component"

export function TipoCargaList({ tipoCargas, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) { 
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
      dataLength={tipoCargas.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más tipos de cargas...</h4>}
      endMessage={<p className='text-center'>No hay más tipos de cargas</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Descripcion</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
              {tipoCargas.map((tipoCarga) => {
                return (
                  <tr key={tipoCarga.id}>
                    <td className='border-dark' style={{ borderRightWidth: 1 }}>{tipoCarga.id}</td>
                    <td className='text-center'>{tipoCarga.name?tipoCarga.name:'Sin nombre'}</td>
                    <td className='text-center'>{tipoCarga.desc?tipoCarga.desc:'Sin descripcion'}</td>
                    <td className='text-center'>{tipoCarga.createdAt? new Date(new Date(tipoCarga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={tipoCarga.estado} />
                    </td>

                    <td className='text-end'>
                      <button style={{ marginTop: '-10px'}}
                        className='btn btn-sm bg-info text-white me-2'
                        onClick={handleEdit.bind(this, tipoCarga)}
                      >
                        Editar
                      </button>
                      <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(tipoCarga.id)}>
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