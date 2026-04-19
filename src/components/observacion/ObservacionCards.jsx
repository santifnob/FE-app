import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function ObservacionCard({ observacion, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Observación #{observacion.id}</h5>
          <EstadoBadge estadoTexto={observacion.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Título:</b> {observacion.titulo ?? 'Sin título'}</p>
        <p className='mb-1'><b>Descripción:</b> {observacion.descripcion ?? 'Sin descripción'}</p>
        <p className='mb-1'><b>Categoría Denuncia:</b> {observacion.categoriaDenuncia ? observacion.categoriaDenuncia.titulo : 'Sin categoría'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {observacion.createdAt
            ? new Date(new Date(observacion.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(observacion)}
          onDelete={() => deleteMutation(observacion.id)}
        />
      </div>
    </div>
  )
}

export function ObservacionCards({
  observaciones,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={observaciones}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más observaciones...'
      endText='No hay más observaciones'
    >
      <div className='px-2'>
        {observaciones.map((observacion) => (
          <ObservacionCard
            key={observacion.id}
            observacion={observacion}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}