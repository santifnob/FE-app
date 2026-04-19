import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { ObservacionCards } from './ObservacionCards.jsx'
import { ObservacionTable } from './ObservacionTable.jsx'

export function ObservacionList({
  observaciones,
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
        <ObservacionTable
          observaciones={observaciones}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <ObservacionCards
          observaciones={observaciones}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}
