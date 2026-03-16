import InfiniteScroll from 'react-infinite-scroll-component'
import { EstadoBadge } from './EstadoBadge.jsx'
import { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { ViajeDetails } from './ViajeDetails.jsx';

export function ViajeCard({ viaje, handleEdit, deleteMutation, setShowDetails, setSelectedViaje }) {

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          Viaje #{viaje.id} 
          <span className='ms-3'>
            <EstadoBadge viaje={viaje} variant="card" />
          </span>
        </h5>
        
        <p className="mb-1">
          {viaje.recorrido?.ciudadSalida} → {viaje.recorrido?.ciudadLlegada}
        </p>

        <p className="mb-1">
          🚆 <b>Tren</b> {viaje.tren?.modelo}
        </p>

        <p className="mb-3">
          👤 {viaje.conductor?.nombre} {viaje.conductor?.apellido}
        </p>

        <p className="mb-1">
          📅 {new Date(viaje.fechaIni).toLocaleDateString('es-AR')}
        </p>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-outline-primary btn-sm"
            onClick={() => { setSelectedViaje(viaje); setShowDetails(true) }}
          >
            Ver detalles
          </button>

          <button
            className="btn btn-info btn-sm text-white"
            onClick={() => handleEdit(viaje)}
          >
            Editar
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteMutation(viaje.id)}
          >
            Eliminar
          </button>
        </div>

      </div>
    </div>
  )
}

export function ViajeCards({ viajes, fetchNextPage, hasNextPage, handleEdit, deleteMutation }) {
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
      {viajes.map(viaje => (
        <ViajeCard
          key={viaje.id}
          viaje={viaje}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          setShowDetails={setShowDetails}
          setSelectedViaje={setSelectedViaje}
        />
      ))}

      {showDetails && selectedViaje && (
              <Modal onClose={() => setShowDetails(false)} title={`Detalles Viaje #${selectedViaje.id}`}>
                <ViajeDetails viaje={selectedViaje} />
              </Modal>
            )}
    </InfiniteScroll>

    
  )
}