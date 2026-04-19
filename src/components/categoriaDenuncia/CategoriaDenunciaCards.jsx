import { CrudActions } from '../shared/CrudActions.jsx'
import { CrudInfiniteScroll } from '../shared/CrudInfiniteScroll.jsx'
import { EstadoBadge } from '../shared/EstadoBadge.jsx'

function CategoriaDenunciaCard({ categoriaDenuncia, handleEdit, deleteMutation }) {
  return (
    <div className='card mb-3 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <h5 className='card-title mb-0'>Categoría #{categoriaDenuncia.id}</h5>
          <EstadoBadge estadoTexto={categoriaDenuncia.estado ?? 'Sin estado'} variant='card' />
        </div>

        <p className='mb-1'><b>Título:</b> {categoriaDenuncia.titulo ?? 'Sin título'}</p>
        <p className='mb-1'><b>Descripción:</b> {categoriaDenuncia.descripcion ?? 'Sin descripción'}</p>

        <p className='mb-0'>
          <b>Creado:</b>{' '}
          {categoriaDenuncia.createdAt
            ? new Date(new Date(categoriaDenuncia.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
            : 'Sin fecha'}
        </p>

        <CrudActions
          onEdit={() => handleEdit(categoriaDenuncia)}
          onDelete={() => deleteMutation(categoriaDenuncia.id)}
        />
      </div>
    </div>
  )
}

export function CategoriaDenunciaCards({
  categoriaDenuncias,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation
}) {
  return (
    <CrudInfiniteScroll
      items={categoriaDenuncias}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más categorías de denuncias...'
      endText='No hay más categorías de denuncias'
    >
      <div className='px-2'>
        {categoriaDenuncias.map((categoriaDenuncia) => (
          <CategoriaDenunciaCard
            key={categoriaDenuncia.id}
            categoriaDenuncia={categoriaDenuncia}
            handleEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ))}
      </div>
    </CrudInfiniteScroll>
  )
}