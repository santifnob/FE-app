import { Modal } from '../../components/Modal.jsx'
import { EstadoTrenForm } from '../../components/estadoTren/EstadoTrenForm.jsx'
import { EstadoTrenList } from '../../components/estadoTren/EstadoTrenList.jsx'
import { useEstadoTrenCrud } from '../../hooks/estadoTren/useEstadoTrenCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'
import { useFeedback } from '../../context/FeedbackContext.jsx'

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
    handleAscOrder,
    handleApplyFilters
  } = useEstadoTrenCrud()
  const { showFeedback } = useFeedback()

  const handleDelete = async (id) => {
    try {
      await deleteMutation(id)
      showFeedback('success', 'Estado eliminado', 'El estado del tren se eliminó correctamente.')
    } catch (error) {
      console.error(error)
      showFeedback('danger', 'Error', 'No se pudo eliminar el estado del tren. Intenta nuevamente.')
    }
  }

  const estadoTrenFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'nombre', label: 'Nombre', type: 'partial' },
    { key: 'fechaVigencia', label: 'Fecha de vigencia', type: 'dateRange', startKey: 'fechaVigenciaIni', endKey: 'fechaVigenciaFin' },
    {
      key: 'estado', label: 'Estado', type: 'exact', options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
      ]
    },
    { key: 'trenId', label: 'ID Tren', type: 'id' },
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' },
    { key: 'modeloTren', label: 'Modelo de tren', type: 'partial' }
  ]

  if (isLoading) return <LoadingScreen title='Cargando estados de tren...' />

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Estados de trenes</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='estadoTren'
          availableAttributes={estadoTrenFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear un estado de Tren
        </button>
      </div>
      {/* Logica pensada para ordenar los estadoTrenes segun el atributo que apreta el usuario, todavian no hecha */}
      <EstadoTrenList estadoTrenes={estadoTrenes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={handleDelete} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(estadoTrenToEdit.current ? 'Editar' : 'Crear') + ' EstadoTren'}>
          <EstadoTrenForm onSuccess={() => setShowModal(false)} estadoTrenToEdit={estadoTrenToEdit.current} />
        </Modal>
      }
    </div>

  )
}
