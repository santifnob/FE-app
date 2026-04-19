import InfiniteScroll from 'react-infinite-scroll-component'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll'
import { CrudActions } from '../shared/CrudActions'
import { EstadoBadgeTren } from './EstadoBadgeTren'

export function TrenTable({ trenes, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  

  return (

    <CrudInfiniteScroll
      items={trenes}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más trenes...'
      endText='No hay más trenes'
    >
      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span></td>
              <td className='text-center'>Modelo</td>
              <td className='text-center'>Color</td>
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado Actual</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {trenes.map((tren) => {
              return (
                <tr key={tren.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{tren.id}</td>
                  <td className='text-center'>{tren.modelo ? tren.modelo : 'Sin modelo'}</td>
                  <td className='text-center'>{tren.color ? tren.color : 'Sin color'}</td>
                  <td className='text-center'>{tren.createdAt ? new Date(new Date(tren.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}</td>

                  <td className='text-center'>
                    <EstadoBadgeTren estado={tren.estadoActual?.nombre ?? 'Sin estado'} />
                  </td>

                  <td className='text-end'>
                    <CrudActions
                      onEdit={() => handleEdit(tren)}
                      onDelete={() => deleteMutation(tren.id)}
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
