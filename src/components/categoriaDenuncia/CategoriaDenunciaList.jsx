import InfiniteScroll from "react-infinite-scroll-component"

export function CategoriaDenunciaList({ categoriaDenuncias, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) { 
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
      dataLength={categoriaDenuncias.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más categorias de denuncias...</h4>}
      endMessage={<p className='text-center'>No hay más categorias de denuncias</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Titulo</td>
              <td className='text-center'>Descripcion</td>
              
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
              {categoriaDenuncias.map((categoriaDenuncia) => {
                return (
                  <tr key={categoriaDenuncia.id}>
                    <td className='border-dark' style={{ borderRightWidth: 1 }}>{categoriaDenuncia.id}</td>
                    <td className='text-center'>{categoriaDenuncia.titulo ? categoriaDenuncia.titulo : 'Sin titulo'}</td>
                    <td className='text-center'>{categoriaDenuncia.descripcion? categoriaDenuncia.descripcion : 'Sin descripcion'}</td>
                    <td className='text-center'>{categoriaDenuncia.createdAt? new Date(new Date(categoriaDenuncia.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                    <td className='text-center'>
                      <EstadoBadge estado={categoriaDenuncia.estado} />
                    </td>
                    
                    <td className='text-end'>
                      <button style={{ marginTop: '-10px'}}
                        className='btn btn-sm bg-info text-white me-2'
                        onClick={handleEdit.bind(this, categoriaDenuncia)}
                      >
                        Editar
                      </button>
                      <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(categoriaDenuncia.id)}>
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