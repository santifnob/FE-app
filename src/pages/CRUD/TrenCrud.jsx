import { Modal } from '../../components/Modal.jsx'
import { TrenForm } from '../../components/tren/TrenForm.jsx'
import { TrenList } from '../../components/tren/TrenList.jsx'
import { useTrenCrud } from '../../hooks/tren/useTrenCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'

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
  { key: 'estadoTren', label: 'Estado', type: 'exact', options: [
      { label: 'Disponible', value: 'Disponible' },
      { label: 'En Reparacion', value: 'En Reparacion' },
      { label: 'Obsoleto', value: 'Obsoleto' }
    ]},
  { key: 'fechaCreacion', label: 'Fecha de creacion', type: 'dateRange', startKey: 'fechaIni', endKey: 'fechaFin' }
]

  if (isLoading) return < LoadingScreen title='Cargando trenes...' />

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
