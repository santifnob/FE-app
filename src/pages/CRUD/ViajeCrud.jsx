import { Modal } from '../../components/Modal.jsx'
import { ViajeForm } from '../../components/viaje/ViajeForm.jsx'
import { ViajeList } from '../../components/viaje/ViajeList.jsx'
import { useViajeCrud } from '../../hooks/viaje/useViajeCrud.js'

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
      {/* Logica pensada para ordenar los viajes segun el atributo que apreta el usuario, todavian no hecha */ }
      <ViajeList viajes={viajes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(viajeToEdit.current ? 'Editar' : 'Crear') + ' Viaje'}>
          <ViajeForm onSuccess={() => setShowModal(false)} viajeToEdit={viajeToEdit.current} />
        </Modal>
      }
    </div>

  )
}
