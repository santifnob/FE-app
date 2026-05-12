import { Modal } from '../../components/Modal.jsx'
import { ConductorForm } from '../../components/conductor/ConductorForm.jsx'
import { ConductorList } from '../../components/conductor/ConductorList.jsx'
import { useConductorCrud } from '../../hooks/conductor/useConductorCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'
import { useFeedback } from '../../context/FeedbackContext.jsx'

export function ConductorCrud() {

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
    handleAscOrder,
    handleApplyFilters
  } = useConductorCrud()
  const { showFeedback } = useFeedback()

  const handleDelete = async (conductorId) => {
    try {
      await deleteMutation(conductorId)
      showFeedback('success', 'Conductor eliminado', 'El conductor se eliminó correctamente.')
    } catch (error) {
      console.error(error)
      showFeedback('danger', 'Error', 'No se pudo eliminar el conductor. Intenta nuevamente.')
    }
  }

  const conductorFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'nombre', label: 'Nombre', type: 'partial' },
    { key: 'apellido', label: 'Apellido', type: 'partial' },
    { key: 'email', label: 'Email', type: 'partial' },
    {
      key: 'estado', label: 'Estado', type: 'exact', options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
      ]
    },
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' }
  ]

  if (isLoading) return <LoadingScreen title='Cargando conductores...' />

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Conductores</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='conductor'
          availableAttributes={conductorFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear un Conductor
        </button>
      </div>
      {/* Logica pensada para ordenar los Conductors segun el atributo que apreta el usuario, todavian no hecha */}
      <ConductorList conductores={conductores} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={handleDelete} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(conductorToEdit.current ? 'Editar' : 'Crear') + ' Conductor'}>
          <ConductorForm onSuccess={() => setShowModal(false)} conductorToEdit={conductorToEdit.current} />
        </Modal>
      }
    </div>

  )
}
