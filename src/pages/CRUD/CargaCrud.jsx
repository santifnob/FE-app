import { Modal } from '../../components/Modal.jsx'
import { CargaForm } from '../../components/carga/CargaForm.jsx'
import { CargaList } from '../../components/carga/CargaList.jsx'
import { useCargaCrud } from '../../hooks/carga/useCargasCrud.js'

export function CargaCrud() {
  const {
    cargas,
    showModal,
    setShowModal,
    cargaToEdit,
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
  } = useCargaCrud()

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Cargas</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear una carga
        </button>
      </div>
      {/* Logica pensada para ordenar los cargas segun el atributo que apreta el usuario, todavian no hecha */ }
      <CargaList cargas={cargas} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(cargaToEdit.current ? 'Editar' : 'Crear') + ' Carga'}>
          <CargaForm onSuccess={() => setShowModal(false)} cargaToEdit={cargaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
