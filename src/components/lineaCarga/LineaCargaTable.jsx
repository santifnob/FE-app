import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function LineaCargaTable({ lineaCargas, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={lineaCargas}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más líneas de carga...'
      endText='No hay más líneas de carga'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Cantidad vagón</td>
              <td className='text-center'>Carga</td>
              <td className='text-center'>Viaje</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {lineaCargas.map((lineaCarga) => {
              return (
                <tr key={lineaCarga.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{lineaCarga.id}</td>
                  <td className='text-center'>{lineaCarga.cantidadVagon ? lineaCarga.cantidadVagon : 'Sin cantidad'}</td>
                  <td className='text-center'>{lineaCarga.carga ? `${lineaCarga.carga.name} #${lineaCarga.carga.id}` : 'Sin carga'}</td>
                  <td className='text-center'>{lineaCarga.viaje ? `Viaje #${lineaCarga.viaje.id}` : 'Sin viaje'}</td>
                  <td className='text-center'>{lineaCarga.createdAt ? new Date(new Date(lineaCarga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={lineaCarga.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(lineaCarga)}
                      onDelete={() => deleteMutation(lineaCarga.id)}
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