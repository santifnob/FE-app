import { Modal } from '../../components/Modal.jsx'
import { ConductorForm } from '../../components/conductor/ConductorForm.jsx'
import { ConductorList } from '../../components/conductor/ConductorList.jsx'
import { useConductorCrud } from '../../hooks/conductor/useConductorCrud.js'

export function ConductorCrud () {

  const {
    conductores,
    showModal,
    setShowModal,
    conductorToEdit,
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
  } = useConductorCrud()

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Conductores</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear un Conductor
        </button>
      </div>
      {/* Logica pensada para ordenar los Conductors segun el atributo que apreta el usuario, todavian no hecha */}
      <ConductorList conductores={conductores} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />

      {
        showModal &&
          <Modal onClose={() => setShowModal(false)} title={(conductorToEdit.current ? 'Editar' : 'Crear') + ' Conductor'}>
          <ConductorForm onSuccess={() => setShowModal(false)} conductorToEdit={conductorToEdit.current} />
        </Modal>
      }
    </div>

  )
}
