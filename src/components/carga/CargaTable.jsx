import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function CargaTable({ cargas, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={cargas}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más cargas...'
      endText='No hay más cargas'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Precio</td>
              <td className='text-center'>Tipo de carga</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {cargas.map((carga) => {
              return (
                <tr key={carga.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{carga.id}</td>
                  <td className='text-center'>{carga.name ? carga.name : 'Sin nombre'}</td>
                  <td className='text-center'>${carga.precio ? carga.precio : 'Sin precio'}</td>
                  <td className='text-center'>{carga.tipoCarga && carga.tipoCarga.estado === 'Activo' ? carga.tipoCarga.name : 'Sin tipo de carga'}</td>
                  <td className='text-center'>{carga.createdAt ? new Date(new Date(carga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={carga.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(carga)}
                      onDelete={() => deleteMutation(carga.id)}
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