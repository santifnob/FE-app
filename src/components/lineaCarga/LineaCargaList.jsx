import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { LineaCargaCards } from './LineaCargaCards.jsx'
import { LineaCargaTable } from './LineaCargaTable.jsx'

export function LineaCargaList({
  lineaCargas,
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
        <LineaCargaTable
          lineaCargas={lineaCargas}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <LineaCargaCards
          lineaCargas={lineaCargas}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}
