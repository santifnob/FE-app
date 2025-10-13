import { Modal } from '../../components/Modal.jsx'
import { TrenForm } from '../../components/tren/TrenForm.jsx'
import { TrenList } from '../../components/tren/TrenList.jsx'
import { useTrenCrud } from '../../hooks/tren/useTrenCrud.js'

export function TrenCrud() {
  const {
    trenes,
    showModal,
    setShowModal,
    trenToEdit,
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
  } = useTrenCrud()


  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Trenes</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear un tren
        </button>
      </div>
      {/* Logica pensada para ordenar los trenes segun el atributo que apreta el usuario, todavian no hecha */ }
      <TrenList trenes={trenes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(trenToEdit.current ? 'Editar' : 'Crear') + ' Tren'}>
          <TrenForm onSuccess={() => setShowModal(false)} trenToEdit={trenToEdit.current} />
        </Modal>
      }
    </div>

  )
}
