import { Modal } from '../../components/Modal.jsx'
import { EstadoTrenForm } from '../../components/estadoTren/EstadoTrenForm.jsx'
import { EstadoTrenList } from '../../components/estadoTren/EstadoTrenList.jsx'
import { useEstadoTrenCrud } from '../../hooks/estadoTren/useEstadoTrenCrud.js'

export function EstadoTrenCrud() {
  
  const {
    estadoTrenes,
    showModal,
    setShowModal,
    estadoTrenToEdit,
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
  } = useEstadoTrenCrud()


  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Estados de trenes</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear un estado de Tren
        </button>
      </div>
      {/* Logica pensada para ordenar los estadoTrenes segun el atributo que apreta el usuario, todavian no hecha */ }
      <EstadoTrenList estadoTrenes={estadoTrenes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(estadoTrenToEdit.current ? 'Editar' : 'Crear') + ' EstadoTren'}>
          <EstadoTrenForm onSuccess={() => setShowModal(false)} estadoTrenToEdit={estadoTrenToEdit.current} />
        </Modal>
      }
    </div>

  )
}
