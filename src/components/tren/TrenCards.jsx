import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadgeTren } from './EstadoBadgeTren.jsx'

function TrenCard({ tren, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Tren #{tren.id}</h5>
          <EstadoBadgeTren variant={"card"} estado={tren.estadoActual?.nombre ?? 'Sin estado'} />
        </div>

        <p className='mb-1'><b>Modelo:</b> {tren.modelo ?? 'Sin modelo'}</p>
        <p className='mb-1'><b>Color:</b> {tren.color ?? 'Sin color'}</p>
        
        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {tren.createdAt
            ? new Date(new Date(tren.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(tren)}
          onDelete={() => deleteMutation(tren.id)}
        />
      </div>
    </div>
  )
}

export function TrenCards({
  trenes,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={trenes}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más trenes...'
      endText='No hay más trenes'
    >
      <div className='px-2'>
        {trenes.map((tren) => (
          <TrenCard
            key={tren.id}
            tren={tren}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}