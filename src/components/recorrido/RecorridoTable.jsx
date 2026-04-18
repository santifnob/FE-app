import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function RecorridoTable({
  recorridos,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation,
  handleAscOrder,
  ascOrder
}) {
  return (
    <CrudInfiniteScroll
      items={recorridos}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más recorridos...'
      endText='No hay más recorridos'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>
                ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span>
              </td>
              <td className='text-center'>Ciudad Salida</td>
              <td className='text-center'>Ciudad Llegada</td>
              <td className='text-center'>Total de Km</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {recorridos.map((recorrido) => (
              <tr key={recorrido.id}>
                <td className='border-dark' style={{ borderRightWidth: 1 }}>
                  {recorrido.id}
                </td>
                <td className='text-center'>
                  {recorrido.ciudadSalida ?? 'Sin ciudad de salida'}
                </td>
                <td className='text-center'>
                  {recorrido.ciudadLlegada ?? 'Sin ciudad de llegada'}
                </td>
                <td className='text-center'>
                  {recorrido.totalKm ?? 'Sin total de km'}
                </td>
                <td className='text-center'>
                  {recorrido.createdAt
                    ? new Date(new Date(recorrido.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
                    : 'Sin fecha'}
                </td>
                <td className='text-center align-middle'>
                  <EstadoBadge estadoTexto={recorrido.estado} />
                </td>
                <td className='text-end align-middle'>
                  <CrudActions
                    onEdit={() => handleEdit(recorrido)}
                    onDelete={() => deleteMutation(recorrido.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CrudInfiniteScroll>
  )
}