import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function EstadoTrenCard({ estadoTren, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Estado Tren #{estadoTren.id}</h5>
          <EstadoBadge estadoTexto={estadoTren.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Tren: </b> {estadoTren.tren.modelo ?? 'Sin Modelo'} #{estadoTren.tren.id ?? "Sin ID"}</p>
        <p className='mb-1'><b>Nombre:</b> {estadoTren.nombre ?? 'Sin nombre'}</p>
        <p className='mb-1'><b>Descripción:</b> {estadoTren.descripcion ?? 'Sin descripción'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {estadoTren.createdAt
            ? new Date(new Date(estadoTren.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(estadoTren)}
          onDelete={() => deleteMutation(estadoTren.id)}
        />
      </div>
    </div>
  )
}

export function EstadoTrenCards({
  estadoTrenes,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={estadoTrenes}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más estados de tren...'
      endText='No hay más estados de tren'
    >
      <div className='px-2'>
        {estadoTrenes.map((estadoTren) => (
          <EstadoTrenCard
            key={estadoTren.id}
            estadoTren={estadoTren}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}