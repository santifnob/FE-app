import { Modal } from '../../components/Modal.jsx'
import { LineaCargaForm } from '../../components/lineaCarga/LineaCargaForm.jsx'
import { LineaCargaList } from '../../components/lineaCarga/LineaCargaList.jsx'
import { useLineaCargaCrud } from '../../hooks/lineaCarga/useLineaCargaCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'

export function LineaCargaCrud() {
  const {
    lineaCargas,
    showModal,
    setShowModal,
    lineaCargaToEdit,
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
  } = useLineaCargaCrud()

  const lineaCargaFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'cantidadVagon', label: 'Cantidad de vagones', type: 'range' },
    { key: 'estado', label: 'Estado', type: 'exact', options: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' }
    ]},
    { key: 'cargaId', label: 'ID Carga', type: 'id' },
    { key: 'viajeId', label: 'ID Viaje', type: 'id' },
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' }
  ]

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Lineas de Cargas</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='lineaCarga'
          availableAttributes={lineaCargaFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear una Linea de Carga
        </button>
      </div>
      {/* Logica pensada para ordenar los LineaCargas segun el atributo que apreta el usuario, todavia no hecha */}
      <LineaCargaList lineaCargas={lineaCargas} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(lineaCargaToEdit.current ? 'Editar' : 'Crear') + ' LineaCarga'}>
          <LineaCargaForm onSuccess={() => setShowModal(false)} lineaCargaToEdit={lineaCargaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
