import { Modal } from '../../components/Modal.jsx'
import { LicenciaForm } from '../../components/licencia/LicenciaForm.jsx'
import { LicenciaList } from '../../components/licencia/LicenciaList.jsx'
import { useLicenciaCrud } from '../../hooks/licencia/useLicenciaCrud.js'

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
    handleAscOrder
  } = useLicenciaCrud()

  if (isLoading) return <h1 className='text-center'>Cargando..</h1>

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Licencias</h1>

      <div className='d-flex justify-content-between mb-4'>
        <button
          className='btn btn-info'
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
