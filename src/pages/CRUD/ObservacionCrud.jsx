import { Modal } from '../../components/Modal.jsx'
import { ObservacionForm } from '../../components/observacion/ObservacionForm.jsx'
import { ObservacionList } from '../../components/observacion/ObservacionList.jsx'
import { useObservacionCrud } from '../../hooks/observacion/useObservacionCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'

export function ObservacionCrud() {
  const {
    observaciones,
    showModal,
    setShowModal,
    observacionToEdit,
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
  } = useObservacionCrud()

  const observacionFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'observaciones', label: 'Observaciones', type: 'partial' },
    { key: 'estado', label: 'Estado', type: 'exact', options: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' }
    ]},
    { key: 'categoriaDenunciaId', label: 'ID Categoría Denuncia', type: 'id' },
    { key: 'viajeId', label: 'ID Viaje', type: 'id' },
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' }
  ]

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Observaciones</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='observacion'
          availableAttributes={observacionFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear una Observacion
        </button>
      </div>
      {/* Logica pensada para ordenar los Observaciones segun el atributo que apreta el usuario, todavia no hecha */}
      <ObservacionList observaciones={observaciones} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(observacionToEdit.current ? 'Editar' : 'Crear') + ' Observacion'}>
          <ObservacionForm onSuccess={() => setShowModal(false)} observacionToEdit={observacionToEdit.current} />
        </Modal>
      }
    </div>

  )
}
