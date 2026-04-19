import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function CargaCard({ carga, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Carga #{carga.id}</h5>
          <EstadoBadge estadoTexto={carga.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Nombre:</b> {carga.name ?? 'Sin nombre'}</p>
        <p className='mb-1'><b>Precio:</b> {carga.precio ?? 'Sin precio'}</p>
        <p className='mb-1'><b>Tipo de carga:</b> {carga.tipoCarga && carga.tipoCarga.estado === 'Activo' ? carga.tipoCarga.name : 'Sin tipo de carga'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {carga.createdAt
            ? new Date(new Date(carga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(carga)}
          onDelete={() => deleteMutation(carga.id)}
        />
      </div>
    </div>
  )
}

export function CargaCards({
  cargas,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={cargas}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más cargas...'
      endText='No hay más cargas'
    >
      <div className='px-2'>
        {cargas.map((carga) => (
          <CargaCard
            key={carga.id}
            carga={carga}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}