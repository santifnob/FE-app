import { Modal } from '../../components/Modal.jsx'
import { ViajeForm } from '../../components/viaje/ViajeForm.jsx'
import { ViajeTableExpandable } from '../../components/viaje/ViajeTableExpandable.jsx'
import { useViajeCrud } from '../../hooks/viaje/useViajeCrud.js'
import { ViajeCards } from '../../components/viaje/ViajeCards.jsx'

export function ViajeCrud() {
  const {
    viajes,
    showModal,
    setShowModal,
    viajeToEdit,
    deleteMutation,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    ascOrder,
    handleEdit,
    handleCreate,
    handleAscOrder
  } = useViajeCrud()

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Viajes</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear un viaje
        </button>
      </div>
      <>
      {/* TABLA DESKTOP */}
      <div className="d-none d-md-block">
        <ViajeTableExpandable viajes={viajes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />
      </div>

      {/* CARDS MOBILE */}
      <div className="d-md-none">
        <ViajeCards viajes={viajes} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />
      </div>
      </>

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(viajeToEdit.current ? 'Editar' : 'Crear') + ' Viaje'}>
          <ViajeForm onSuccess={() => setShowModal(false)} viajeToEdit={viajeToEdit.current} />
        </Modal>
      }
    </div>

  )
}
