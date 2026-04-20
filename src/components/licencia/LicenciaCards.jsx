import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function LicenciaCard({ licencia, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Licencia #{licencia.id}</h5>
          <EstadoBadge estadoTexto={licencia.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Fecha de Emisión:</b> {licencia.fechaHecho ? new Date(new Date(licencia.fechaHecho).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</p>
        <p className='mb-1'><b>Fecha de Vencimiento:</b> {licencia.fechaVencimiento ? new Date(new Date(licencia.fechaVencimiento).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</p>
        <p className='mb-1'><b>Conductor:</b> {licencia.conductor ? `${licencia.conductor.nombre} ${licencia.conductor.apellido} #${licencia.conductor.id}` : 'Sin conductor'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {licencia.createdAt
            ? new Date(new Date(licencia.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(licencia)}
          onDelete={() => deleteMutation(licencia.id)}
        />
      </div>
    </div>
  )
}

export function LicenciaCards({
  licencias,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={licencias}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más licencias...'
      endText='No hay más licencias'
    >
      <div className='px-2'>
        {licencias.map((licencia) => (
          <LicenciaCard
            key={licencia.id}
            licencia={licencia}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}