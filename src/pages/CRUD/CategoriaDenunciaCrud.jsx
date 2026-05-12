import { Modal } from '../../components/Modal.jsx'
import { CategoriaDenunciaForm } from '../../components/categoriaDenuncia/CategoriaDenunciaForm.jsx'
import { CategoriaDenunciaList } from '../../components/categoriaDenuncia/CategoriaDenunciaList.jsx'
import { useCategoriaDenunciaCrud } from '../../hooks/categoriaDenuncia/useCategoriaDenunciaCrud.js'
import { EntityFilters } from '../../components/EntityFilters.jsx'
import { LoadingScreen } from '../../components/shared/LoadingScreen.jsx'
import { useFeedback } from '../../context/FeedbackContext.jsx'

export function CategoriaDenunciaCrud() {

  const {
    categoriaDenuncias,
    showModal,
    setShowModal,
    categoriaDenunciaToEdit,
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
  } = useCategoriaDenunciaCrud()
  const { showFeedback } = useFeedback()

  const handleDelete = async (categoriaDenunciaId) => {
    try {
      await deleteMutation(categoriaDenunciaId)
      showFeedback('success', 'Categoría eliminada', 'La categoría de denuncia se eliminó correctamente.')
    } catch (error) {
      console.error(error)
      showFeedback('danger', 'Error', 'No se pudo eliminar la categoría de denuncia. Intenta nuevamente.')
    }
  }

  const categoriaDenunciaFilterAttributes = [
    { key: 'id', label: 'ID', type: 'id' },
    { key: 'titulo', label: 'Título', type: 'partial' },
    { key: 'descripcion', label: 'Descripción', type: 'partial' },
    {
      key: 'estado', label: 'Estado', type: 'exact', options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
      ]
    },
    { key: 'createdAt', label: 'Fecha de creación', type: 'dateRange', startKey: 'fechaCreacionIni', endKey: 'fechaCreacionFin' }
  ]

  if (isLoading) return <LoadingScreen title='Cargando categorias de denuncias...' />

  if (isError) return <h1>{error}</h1>

  return (
    <div>
      <h1 className='h1 mt-2 text-center'>Lista de Categorias de Denuncias</h1>

      <div className='d-flex justify-content-start align-items-start gap-3 mb-4'>
        <EntityFilters
          entityName='categoriaDenuncia'
          availableAttributes={categoriaDenunciaFilterAttributes}
          onApplyFilters={handleApplyFilters}
        />
        <button
          className='btn btn-info flex-shrink-0'
          onClick={handleCreate}
        >
          Crear una Categoria de Denuncia
        </button>

      </div>
      {/* Logica pensada para ordenar los categoriaDenuncias segun el atributo que apreta el usuario, todavian no hecha */}
      <CategoriaDenunciaList categoriaDenuncias={categoriaDenuncias} handleAscOrder={handleAscOrder} ascOrder={ascOrder} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} handleEdit={handleEdit} deleteMutation={handleDelete} />

      {
        showModal &&
        <Modal onClose={() => setShowModal(false)} title={(categoriaDenunciaToEdit.current ? 'Editar' : 'Crear') + ' CategoriaDenuncia'}>
          <CategoriaDenunciaForm onSuccess={() => setShowModal(false)} categoriaDenunciaToEdit={categoriaDenunciaToEdit.current} />
        </Modal>
      }
    </div>

  )
}
