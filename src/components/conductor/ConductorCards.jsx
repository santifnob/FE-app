import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadgeConductor } from './EstadoBadgeConductor.jsx'

function ConductorCard({ conductor, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Conductor #{conductor.id}</h5>
          <EstadoBadgeConductor estado={conductor.estado} variant='card'/>
        </div>

        <p className='mb-1'><b>Nombre:</b> {conductor.nombre ?? 'Sin nombre'}</p>
        <p className='mb-1'><b>Apellido:</b> {conductor.apellido ?? 'Sin apellido'}</p>
        <p className='mb-1'><b>Email:</b> {conductor.email ?? 'Sin email'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {conductor.createdAt
            ? new Date(new Date(conductor.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(conductor)}
          onDelete={() => deleteMutation(conductor.id)}
        />
      </div>
    </div>
  )
}

export function ConductorCards({
  conductores,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={conductores}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más conductores...'
      endText='No hay más conductores'
    >
      <div className='px-2'>
        {conductores.map((conductor) => (
          <ConductorCard
            key={conductor.id}
            conductor={conductor}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}