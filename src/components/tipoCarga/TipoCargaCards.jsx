import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function TipoCargaCard({ tipoCarga, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Tipo Carga #{tipoCarga.id}</h5>
          <EstadoBadge estadoTexto={tipoCarga.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Nombre:</b> {tipoCarga.name ?? 'Sin nombre'}</p>
        <p className='mb-1'><b>Descripción:</b> {tipoCarga.desc ?? 'Sin descripción'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {tipoCarga.createdAt
            ? new Date(new Date(tipoCarga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(tipoCarga)}
          onDelete={() => deleteMutation(tipoCarga.id)}
        />
      </div>
    </div>
  )
}

export function TipoCargaCards({
  tipoCargas,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={tipoCargas}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más tipos de carga...'
      endText='No hay más tipos de carga'
    >
      <div className='px-2'>
        {tipoCargas.map((tipoCarga) => (
          <TipoCargaCard
            key={tipoCarga.id}
            tipoCarga={tipoCarga}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}