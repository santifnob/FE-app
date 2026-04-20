import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function LineaCargaCard({ lineaCarga, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Línea Carga #{lineaCarga.id}</h5>
          <EstadoBadge estadoTexto={lineaCarga.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Cantidad:</b> {lineaCarga.cantidadVagon ?? 'Sin cantidad'}</p>
        <p className='mb-1'><b>Carga:</b> {lineaCarga.carga ? `${lineaCarga.carga.name} #${lineaCarga.carga.id}` : 'Sin carga'}</p>
        <p className='mb-1'><b>Viaje:</b> {lineaCarga.viaje ? `Viaje #${lineaCarga.viaje.id}` : 'Sin viaje'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {lineaCarga.createdAt
            ? new Date(new Date(lineaCarga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(lineaCarga)}
          onDelete={() => deleteMutation(lineaCarga.id)}
        />
      </div>
    </div>
  )
}

export function LineaCargaCards({
  lineaCargas,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={lineaCargas}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más líneas de carga...'
      endText='No hay más líneas de carga'
    >
      <div className='px-2'>
        {lineaCargas.map((lineaCarga) => (
          <LineaCargaCard
            key={lineaCarga.id}
            lineaCarga={lineaCarga}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}