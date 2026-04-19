import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { CategoriaDenunciaCards } from './CategoriaDenunciaCards.jsx'
import { CategoriaDenunciaTable } from './CategoriaDenunciaTable.jsx'

export function CategoriaDenunciaList({
  categoriaDenuncias,
  fetchNextPage,
  hasNextPage,
  handleEdit,
  deleteMutation,
  handleAscOrder,
  ascOrder
}) {
  return (
    <CrudResponsiveList
      desktop={
        <CategoriaDenunciaTable
          categoriaDenuncias={categoriaDenuncias}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <CategoriaDenunciaCards
          categoriaDenuncias={categoriaDenuncias}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}