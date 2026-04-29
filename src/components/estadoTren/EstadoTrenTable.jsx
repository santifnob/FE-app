import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function EstadoTrenTable({ estadoTrenes, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={estadoTrenes}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más estados de tren...'
      endText='No hay más estados de tren'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Tren</td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Fecha de vigencia</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {estadoTrenes.map((estadoTren) => {
              return (
                <tr key={estadoTren.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{estadoTren.id}</td>
                  <td className='text-center'>{estadoTren.tren.modelo ?? 'Sin Modelo'} #{estadoTren.tren.id ?? "Sin ID"}</td>
                  <td className='text-center'>{estadoTren.nombre ? estadoTren.nombre : 'Sin nombre'}</td>
                  <td className='text-center'>{estadoTren.fechaVigencia ? new Date(estadoTren.fechaVigencia).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>{estadoTren.createdAt ? new Date(new Date(estadoTren.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={estadoTren.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(estadoTren)}
                      onDelete={() => deleteMutation(estadoTren.id)}
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