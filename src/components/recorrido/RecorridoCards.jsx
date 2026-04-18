import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function RecorridoCard({ recorrido, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Recorrido #{recorrido.id}</h5>
          <EstadoBadge estadoTexto={recorrido.estado} variant='card'/>
        </div>

        <p className='mb-1'><b>Salida:</b> {recorrido.ciudadSalida ?? 'Sin ciudad de salida'}</p>
        <p className='mb-1'><b>Llegada:</b> {recorrido.ciudadLlegada ?? 'Sin ciudad de llegada'}</p>
        <p className='mb-1'><b>Km:</b> {recorrido.totalKm ?? 'Sin total de km'}</p>
        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {recorrido.createdAt
            ? new Date(new Date(recorrido.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(recorrido)}
          onDelete={() => deleteMutation(recorrido.id)}
        />
      </div>
    </div>
  )
}

export function RecorridoCards({
  recorridos,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={recorridos}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más recorridos...'
      endText='No hay más recorridos'
    >
      <div className='px-2'>
        {recorridos.map((recorrido) => (
          <RecorridoCard
            key={recorrido.id}
            recorrido={recorrido}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}