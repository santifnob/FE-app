import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function CategoriaDenunciaTable({ categoriaDenuncias, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={categoriaDenuncias}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más categorías de denuncias...'
      endText='No hay más categorías de denuncias'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Título</td>
              <td className='text-center'>Descripción</td>
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
                  <td className='text-center'>{categoriaDenuncia.titulo ? categoriaDenuncia.titulo : 'Sin título'}</td>
                  <td className='text-center'>{categoriaDenuncia.descripcion ? categoriaDenuncia.descripcion : 'Sin descripción'}</td>
                  <td className='text-center'>{categoriaDenuncia.createdAt ? new Date(new Date(categoriaDenuncia.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={categoriaDenuncia.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(categoriaDenuncia)}
                      onDelete={() => deleteMutation(categoriaDenuncia.id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </CrudInfiniteScroll>
  )
}