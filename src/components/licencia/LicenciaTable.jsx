import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { CrudActions } from '../shared/CrudActions.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

export function LicenciaTable({ licencias, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  return (
    <CrudInfiniteScroll
      items={licencias}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más licencias...'
      endText='No hay más licencias'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span></td>
              <td className='text-center'>Número de Licencia</td>
              <td className='text-center'>Fecha de Emisión</td>
              <td className='text-center'>Fecha de Vencimiento</td>
              <td className='text-center'>Conductor</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {licencias.map((licencia) => {
              return (
                <tr key={licencia.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{licencia.id}</td>
                  <td className='text-center'>{licencia.numeroLicencia ? licencia.numeroLicencia : 'Sin número'}</td>
                  <td className='text-center'>{licencia.fechaEmision ? new Date(new Date(licencia.fechaEmision).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>{licencia.fechaVencimiento ? new Date(new Date(licencia.fechaVencimiento).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>{licencia.conductor ? licencia.conductor.name : 'Sin conductor'}</td>
                  <td className='text-center'>{licencia.createdAt ? new Date(new Date(licencia.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estadoTexto={licencia.estado ?? 'Sin estado'} />
                  </td>
                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(licencia)}
                      onDelete={() => deleteMutation(licencia.id)}
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