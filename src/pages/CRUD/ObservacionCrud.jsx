import { Modal } from '../../components/Modal.jsx'
import { ObservacionForm } from '../../components/observacion/ObservacionForm.jsx'
import { ObservacionList } from '../../components/observacion/ObservacionList.jsx'
import { useObservacionCrud } from '../../hooks/observacion/useObservacionCrud.js'

export function ObservacionCrud() {
  const {
    observaciones,
    showModal,
    setShowModal,
    observacionToEdit,
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
  } = useObservacionCrud()

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Observaciones</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear una Observacion
        </button>
      </div>
      {/* Logica pensada para ordenar los Observaciones segun el atributo que apreta el usuario, todavia no hecha */}
      <ObservacionList observaciones={observaciones} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(observacionToEdit.current ? 'Editar' : 'Crear') + ' Observacion'}>
          <ObservacionForm onSuccess={() => setShowModal(false)} observacionToEdit={observacionToEdit.current} />
        </Modal>
      }
    </div>

  )
}
