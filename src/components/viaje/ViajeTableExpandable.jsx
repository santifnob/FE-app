import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react'
import { Modal } from '../Modal.jsx'
import { ViajeDetails } from './ViajeDetails.jsx'
import { EstadoBadge } from './EstadoBadge.jsx'

export function ViajeTableExpandable({ viajes, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {

  // elemine la navegacion a cargas/obseravaciones para simplificar el view

  const [showDetails, setShowDetails] = useState(false)
  const [selectedViaje, setSelectedViaje] = useState(null)

  return (
    <InfiniteScroll
      dataLength={viajes.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más viajes...</h4>}
      endMessage={<p className='text-center'>No hay más viajes</p>}
      scrollThreshold={0.8}
      scrollableTarget='scrollableDiv'
    >

      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>
                ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span>
              </td>
              <td className='text-center'>Tren</td>
              <td className='text-center'>Conductor</td>
              <td className='text-center'>Estado</td>
              <td className='text-center'>Fecha Inicio</td>
              <td className='text-center'>Recorrido</td>
              <td className='text-center' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {viajes.map((viaje) => (
              <tr key={viaje.id}>
                <td className='border-dark-center' style={{ borderRightWidth: 1 }}>{viaje.id}</td>
                <td className='text-center'>
                  {viaje.tren?.modelo ? `${viaje.tren.modelo}` : 'Sin modelo'}
                </td>
                <td className='text-center'>
                  {viaje.conductor?.nombre ? `${viaje.conductor.nombre} ${viaje.conductor.apellido}` : 'NN NN'}
                </td>
                <td className='text-center'>
                  <EstadoBadge viaje={viaje} />
                </td>
                <td className='text-center'>
                  {viaje.fechaIni ? new Date(new Date(viaje.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}
                </td>
                <td className='text-center'>
                  {viaje.recorrido ? `${viaje.recorrido.ciudadSalida} → ${viaje.recorrido.ciudadLlegada}` : 'Sin recorrido'}
                </td>
                <td className='text-end'>
                  <div className='d-flex justify-content-end align-items-center gap-2'>
                    <button style={{ marginTop: '-10px' }}
                      className='btn btn-sm btn-outline-primary'
                      onClick={() => { setSelectedViaje(viaje); setShowDetails(true) }}
                    >
                      Ver detalles
                    </button>
                    <button style={{ marginTop: '-10px' }}
                      className='btn btn-sm btn-info text-white'
                      onClick={() => handleEdit(viaje)}
                    >
                      Editar
                    </button>
                    <button style={{ marginTop: '-10px' }}
                      className='btn btn-sm btn-danger'
                      onClick={async () => deleteMutation(viaje.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetails && selectedViaje && (
        <Modal onClose={() => setShowDetails(false)} title={`Detalles Viaje #${selectedViaje.id}`}>
          <ViajeDetails viaje={selectedViaje} />
        </Modal>
      )}
    </InfiniteScroll>
  )
}
