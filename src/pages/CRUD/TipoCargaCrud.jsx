import { Modal } from '../../components/Modal.jsx'
import { TipoCargaForm } from '../../components/tipoCarga/TipoCargaForm.jsx'
import { TipoCargaList } from '../../components/tipoCarga/TipoCargaList.jsx'
import { useTipoCargaCrud } from '../../hooks/tipoCarga/useTipoCargaCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'

export function TipoCargaCrud() {
  const {
    tipoCargas,
    showModal,
    setShowModal,
    tipoCargaToEdit,
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
  } = useTipoCargaCrud()

  const tipoCargaFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'name', label: 'Nombre', type: 'partial' },
    { key: 'desc', label: 'Descripción', type: 'partial' },
    { key: 'estado', label: 'Estado', type: 'exact', options: [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' }
    ]},
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' }
  ]

  if (isLoading) return <LoadingScreen title='Cargando tipos de carga...' />

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Tipos de Cargas</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='tipoCarga'
          availableAttributes={tipoCargaFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear un tipo de Carga
        </button>
      </div>
      {/* Logica pensada para ordenar los tipoCargas segun el atributo que apreta el usuario, todavian no hecha */ }
      <TipoCargaList tipoCargas={tipoCargas} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={deleteMutation}/>
      
      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(tipoCargaToEdit.current ? 'Editar' : 'Crear') + ' TipoCarga'}>
          <TipoCargaForm onSuccess={() => setShowModal(false)} tipoCargaToEdit={tipoCargaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
