import { Modal } from '../../components/Modal.jsx'
import { TrenForm } from '../../components/tren/TrenForm.jsx'
import { TrenList } from '../../components/tren/TrenList.jsx'
import { useTrenCrud } from '../../hooks/tren/useTrenCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'

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
    handleAscOrder,
    handleApplyFilters
  } = useTrenCrud()

  const trenFilterAttributes = [
  { key: 'modelo', label: 'Modelo', type: 'partial' },
  { key: 'id', label: 'Tren ID', type: 'id' },
  { key: 'Estado Tren', label: 'Estado Tren Id', type: 'partial' },
  { key: 'fechaCreacion', label: 'Fecha de creacion', type: 'dateRange', startKey: 'fechaIni', endKey: 'fechaFin' }
]

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Trenes</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='tren'
          availableAttributes={trenFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
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
