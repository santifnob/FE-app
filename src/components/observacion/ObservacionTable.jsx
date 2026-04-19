import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function ObservacionTable({ observaciones, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={observaciones}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más observaciones...'
      endText='No hay más observaciones'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Título</td>
              <td className='text-center'>Descripción</td>
              <td className='text-center'>Categoría Denuncia</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {observaciones.map((observacion) => {
              return (
                <tr key={observacion.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{observacion.id}</td>
                  <td className='text-center'>{observacion.titulo ? observacion.titulo : 'Sin título'}</td>
                  <td className='text-center'>{observacion.descripcion ? observacion.descripcion : 'Sin descripción'}</td>
                  <td className='text-center'>{observacion.categoriaDenuncia ? observacion.categoriaDenuncia.titulo : 'Sin categoría'}</td>
                  <td className='text-center'>{observacion.createdAt ? new Date(new Date(observacion.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={observacion.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(observacion)}
                      onDelete={() => deleteMutation(observacion.id)}
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