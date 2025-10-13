import { Modal } from '../../components/Modal.jsx'
import { TipoCargaForm } from '../../components/tipoCarga/TipoCargaForm.jsx'
import { TipoCargaList } from '../../components/tipoCarga/TipoCargaList.jsx'
import { useTipoCargaCrud } from '../../hooks/tipoCarga/useTipoCargaCrud.js'

export function TipoCargaCrud() {
  const {
    tipoCargas,
    showModal,
    setShowModal,
    tipoCargaToEdit,
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
  } = useTipoCargaCrud()


  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Tipos de Cargas</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear un tipo de Carga
        </button>
      </div>
      {/* Logica pensada para ordenar los tipoCargas segun el atributo que apreta el usuario, todavian no hecha */ }
      <TipoCargaList tipoCargas={tipoCargas} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(tipoCargaToEdit.current ? 'Editar' : 'Crear') + ' TipoCarga'}>
          <TipoCargaForm onSuccess={() => setShowModal(false)} tipoCargaToEdit={tipoCargaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
