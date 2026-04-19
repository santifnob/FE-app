import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function TipoCargaTable({ tipoCargas, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={tipoCargas}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más tipos de carga...'
      endText='No hay más tipos de carga'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Descripción</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {tipoCargas.map((tipoCarga) => {
              return (
                <tr key={tipoCarga.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{tipoCarga.id}</td>
                  <td className='text-center'>{tipoCarga.name ? tipoCarga.name : 'Sin nombre'}</td>
                  <td className='text-center'>{tipoCarga.descripcion ? tipoCarga.descripcion : 'Sin descripción'}</td>
                  <td className='text-center'>{tipoCarga.createdAt ? new Date(new Date(tipoCarga.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={tipoCarga.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(tipoCarga)}
                      onDelete={() => deleteMutation(tipoCarga.id)}
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