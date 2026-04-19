import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadgeConductor } from './EstadoBadgeConductor.jsx'

export function ConductorTable({ conductores, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={conductores}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más conductores...'
      endText='No hay más conductores'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span></td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Apellido</td>
              <td className='text-center'>Email</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {conductores.map((conductor) => {
              return (
                <tr key={conductor.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{conductor.id}</td>
                  <td className='text-center'>{conductor.nombre ? conductor.nombre : 'Sin nombre'}</td>
                  <td className='text-center'>{conductor.apellido ? conductor.apellido : 'Sin apellido'}</td>
                  <td className='text-center'>{conductor.email ? conductor.email : 'Sin email'}</td>
                  <td className='text-center'>{conductor.createdAt ? new Date(new Date(conductor.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadgeConductor estado={conductor.estado} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(conductor)}
                      onDelete={() => deleteMutation(conductor.id)}
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