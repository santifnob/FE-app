import { Modal } from '../../components/Modal.jsx'
import { LicenciaForm } from '../../components/licencia/LicenciaForm.jsx'
import { LicenciaList } from '../../components/licencia/LicenciaList.jsx'
import { useLicenciaCrud } from '../../hooks/licencia/useLicenciaCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'

export function LicenciaCrud() {

  const {
    licencias,
    showModal,
    setShowModal,
    licenciaToEdit,
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
  } = useLicenciaCrud()

  const licenciaFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'estado', label: 'Estado', type: 'exact', options: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' }
    ]},
    { key: 'fechaHecho', label: 'Fecha de hecho', type: 'dateRange', startKey: 'fechaHechoIni', endKey: 'fechaHechoFin' },
    { key: 'fechaVencimiento', label: 'Fecha de vencimiento', type: 'dateRange', startKey: 'fechaVencimientoIni', endKey: 'fechaVencimientoFin' },
    { key: 'conductorId', label: 'ID Conductor', type: 'id' },
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' },
    { key: 'conductorNombreYApellido', label: 'Nombre y apellido conductor', type: 'partial' }
  ]

  if (isLoading) return <LoadingScreen title='Cargando licencias...' />

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Licencias</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='licencia'
          availableAttributes={licenciaFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear una Licencia
        </button>
      </div>
      {/* Logica pensada para ordenar los Licencias segun el atributo que apreta el usuario, todavia no hecha */}
      <LicenciaList licencias={licencias} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(licenciaToEdit.current ? 'Editar' : 'Crear') + ' Licencia'}>
          <LicenciaForm onSuccess={() => setShowModal(false)} licenciaToEdit={licenciaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
