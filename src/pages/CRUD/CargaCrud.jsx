import { Modal } from '../../components/Modal.jsx'
import { CargaForm } from '../../components/carga/CargaForm.jsx'
import { CargaList } from '../../components/carga/CargaList.jsx'
import { useCargaCrud } from '../../hooks/carga/useCargasCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'

export function CargaCrud() {
  const {
    cargas,
    showModal,
    setShowModal,
    cargaToEdit,
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
  } = useCargaCrud()

  const cargaFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'name', label: 'Nombre', type: 'partial' },
    { key: 'precio', label: 'Precio', type: 'range' },
    { key: 'estado', label: 'Estado', type: 'exact', options: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' }
    ]},
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' },
    { key: 'nombreTipoCarga', label: 'Tipo de carga', type: 'partial' }
  ]

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Cargas</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='carga'
          availableAttributes={cargaFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear una carga
        </button>
      </div>
      {/* Logica pensada para ordenar los cargas segun el atributo que apreta el usuario, todavian no hecha */ }
      <CargaList cargas={cargas} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(cargaToEdit.current ? 'Editar' : 'Crear') + ' Carga'}>
          <CargaForm onSuccess={() => setShowModal(false)} cargaToEdit={cargaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
