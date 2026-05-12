import { Modal } from '../../components/Modal.jsx'
import { ViajeForm } from '../../components/viaje/ViajeForm.jsx'
import { ViajeTableExpandable } from '../../components/viaje/ViajeTableExpandable.jsx'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { useViajeCrud } from '../../hooks/viaje/useViajeCrud.js'
import { ViajeCards } from '../../components/viaje/ViajeCards.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'
import { useFeedback } from '../../context/FeedbackContext.jsx'

const viajeFilterAttributes = [
  {
    key: 'estado', label: 'Estado', type: 'exact', options: [
      { value: 'Cancelado/Suspendido', label: 'Cancelado/Suspendido' },
      { value: 'Rechazado', label: 'Rechazado' },
      { value: 'Viaje no aceptado', label: 'Viaje no aceptado' },
      { value: 'Finalizado', label: 'Finalizado' },
      { value: 'Programado', label: 'Programado' },
      { value: 'En curso', label: 'En curso' }
    ]
  },
  { key: 'trenId', label: 'Tren ID', type: 'id' },
  { key: 'conductorId', label: 'Conductor ID', type: 'id' },
  { key: 'recorridoId', label: 'Recorrido ID', type: 'id' },
  { key: 'fechaIni', label: 'Fecha de inicio', type: 'dateRange', startKey: 'fechaIni', endKey: 'fechaFin' },
  { key: 'trenModelo', label: 'Modelo del tren', type: 'partial' },
  { key: 'trenColor', label: 'Color del tren', type: 'partial' },
  { key: 'recorridoCiudadSalida', label: 'Ciudad salida', type: 'partial' },
  { key: 'recorridoCiudadLlegada', label: 'Ciudad llegada', type: 'partial' },
  { key: 'conductorNombreYApellido', label: 'Nombre y apellido conductor', type: 'partial' }
]

export function ViajeCrud() {
  const {
    viajes,
    showModal,
    setShowModal,
    viajeToEdit,
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
  } = useViajeCrud()
  const { showFeedback } = useFeedback()

  if (isLoading) return <LoadingScreen title='Cargando viajes...' />
  const handleDelete = async (viajeId) => {
    try {
      await deleteMutation(viajeId)
      showFeedback('success', 'Viaje eliminado', 'El viaje se eliminó correctamente.')
    } catch (error) {
      console.error(error)
      showFeedback('danger', 'Error', 'No se pudo eliminar el viaje. Intenta nuevamente.')
    }
  }

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Viajes</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='viaje'
          availableAttributes={viajeFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear un viaje
        </button>
      </div>
      <>
        {/* TABLA DESKTOP */}
        <div className="d-none d-md-block">
          <ViajeTableExpandable viajes={viajes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={handleDelete} />
        </div>

        {/* CARDS MOBILE */}
        <div className="d-md-none">
          <ViajeCards viajes={viajes} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={handleDelete} />
        </div>
      </>

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(viajeToEdit.current ? 'Editar' : 'Crear') + ' Viaje'}>
          <ViajeForm onSuccess={() => setShowModal(false)} viajeToEdit={viajeToEdit.current} />
        </Modal>
      }
    </div>

  )
}
