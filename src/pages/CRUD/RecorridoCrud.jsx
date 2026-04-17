import { Modal } from '../../components/Modal.jsx'
import { RecorridoForm } from '../../components/recorrido/RecorridoForm.jsx'
import { RecorridoList } from '../../components/recorrido/RecorridoList.jsx'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { useRecorridoCrud } from '../../hooks/recorrido/useRecorridoCrud.js'

const recorridoFilterAttributes = [
  { key: 'ciudadSalida', label: 'Ciudad Salida', type: 'partial' },
  { key: 'ciudadLlegada', label: 'Ciudad Llegada', type: 'partial' },
  { key: 'estado', label: 'Estado', type: 'exact', options: [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' }
  ] },
  { key: 'totalKm', label: 'Total Km', type: 'range', minKey: 'minKm', maxKey: 'maxKm' }
]

export function RecorridoCrud() {
  const {
    recorridos,
    showModal,
    setShowModal,
    recorridoToEdit,
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
  } = useRecorridoCrud()


  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Recorridos</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='recorrido'
          availableAttributes={recorridoFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear un recorrido
        </button>
      </div>
      {/* Logica pensada para ordenar los recorridos segun el atributo que apreta el usuario, todavian no hecha */ }
      <RecorridoList recorridos={recorridos} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(recorridoToEdit.current ? 'Editar' : 'Crear') + ' Recorrido'}>
          <RecorridoForm onSuccess={() => setShowModal(false)} recorridoToEdit={recorridoToEdit.current} />
        </Modal>
      }
    </div>

  )
}
