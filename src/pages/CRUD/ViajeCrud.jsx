import { useEffect } from 'react'
import { Modal } from '../../components/Modal.jsx'
import { ViajeForm } from '../../components/viaje/ViajeForm.jsx'
import { ViajeTableExpandable } from '../../components/viaje/ViajeTableExpandable.jsx'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { useViajeCrud } from '../../hooks/viaje/useViajeCrud.js'
import { ViajeCards } from '../../components/viaje/ViajeCards.jsx'

const viajeFilterAttributes = [
  { key: 'estado', label: 'Estado', type: 'exact', options: [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En curso', label: 'En curso' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Inactivo', label: 'Inactivo' }
  ] },
  { key: 'trenId', label: 'Tren ID', type: 'id' },
  { key: 'conductorId', label: 'Conductor ID', type: 'id' },
  { key: 'recorridoId', label: 'Recorrido ID', type: 'id' },
  { key: 'fechaIni', label: 'Fecha de inicio', type: 'dateRange', startKey: 'fechaIni', endKey: 'fechaFin' }
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

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('viajeFilters_selected')
      sessionStorage.removeItem('viajeFilters_values')
      sessionStorage.removeItem('viajeFilters_applied')
    }
  }, [])

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Viajes</h1>

      <div className='d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-4'>
        <EntityFilters
          entityName='viaje'
          availableAttributes={viajeFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info'
          onClick={handleCreate}
        >
          Crear un viaje
        </button>
      </div>
      <>
      {/* TABLA DESKTOP */}
      <div className="d-none d-md-block">
        <ViajeTableExpandable viajes={viajes} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />
      </div>

      {/* CARDS MOBILE */}
      <div className="d-md-none">
        <ViajeCards viajes={viajes} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />
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
