import { useState, useEffect } from 'react'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { useViajesConductorInfinite } from '../../../hooks/viaje/useViajesConductorInfinite'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ViajeCardConductor } from './ViajeCardConductor'
import { Modal } from '../../../components/Modal'
import { ViajeDetails } from '../../../components/viaje/ViajeDetails'

// Componente base reutilizable para los 3 estados de viajes
export default function ViajesConductorBase({ estado, titulo, emptyMessage }) {
  // Obtener el usuario logueado
  const { user, isLoading: userLoading } = useCurrentUser()

  // Estado para los viajes y el modal
  const [viajes, setViajes] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [selectedViaje, setSelectedViaje] = useState(null)

  // Hook de infinite scroll para viajes
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: viajesLoading,
    isError,
    error
  } = useViajesConductorInfinite(user?.id, estado)

  // Cada vez que llegan nuevos datos, actualizamos la lista
  useEffect(() => {
    if (data) {
      const todosLosViajes = data.pages.flatMap(page => page.items)
      setViajes(todosLosViajes)
    }
  }, [data])

  // 1. Mostrar mientras carga el usuario
  if (userLoading) {
    return (
      <div className='text-center mt-5'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Cargando usuario...</span>
        </div>
        <p className='mt-2'>Cargando información del conductor...</p>
      </div>
    )
  }

  // 2. Mostrar si no hay usuario autenticado
  if (!user) {
    return (
      <div className='alert alert-warning text-center mt-5'>
        No hay un conductor autenticado. Por favor, inicia sesión.
      </div>
    )
  }

  // 3. Mostrar mientras cargan los viajes
  if (viajesLoading) {
    return (
      <div className='text-center mt-5'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </div>
        <p className='mt-2'>Cargando viajes...</p>
      </div>
    )
  }

  // 4. Mostrar si hay error
  if (isError) {
    return (
      <div className='alert alert-danger text-center mt-5'>
        Error al cargar los viajes: {error.message}
      </div>
    )
  }

  // 5. Renderizado principal
  return (
    <div className='container-fluid mt-4'>
      {/* Header con título y nombre del conductor */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>{titulo}</h2>
        <div className='text-muted'>
          Conductor: {user.nombre} {user.apellido}
        </div>
      </div>

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={viajes.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className='text-center mt-3'>
            <div className='spinner-border spinner-border-sm text-primary' role='status'>
              <span className='visually-hidden'>Cargando...</span>
            </div>
            <p className='mt-2'>Cargando más viajes...</p>
          </div>
        }
        endMessage={
          viajes.length > 0
            ? (
              <p className='text-center mt-3 text-muted'>
                {emptyMessage || 'No hay más viajes'}
              </p>
            )
            : null
        }
        scrollableTarget='scrollableDiv'
      >
        {/* Lista de viajes */}
        {viajes.length === 0
          ? (
            <div className='text-center mt-5'>
              <p className='text-muted'>{emptyMessage || 'No tienes viajes'}</p>
            </div>
          )
          : (
            <div className='row'>
              {viajes.map(viaje => (
                <div key={viaje.id} className='col-12 mb-3'>
                  <ViajeCardConductor
                    viaje={viaje}
                    onViewDetails={() => {
                      setSelectedViaje(viaje)
                      setShowDetails(true)
                    }}
                  />
                </div>
              ))}
            </div>
          )}
      </InfiniteScroll>

      {/* Modal de detalles */}
      {showDetails && selectedViaje && (
        <Modal
          onClose={() => setShowDetails(false)}
          title={`Detalles Viaje #${selectedViaje.id}`}
        >
          <ViajeDetails viaje={selectedViaje} />
        </Modal>
      )}
    </div>
  )
}
