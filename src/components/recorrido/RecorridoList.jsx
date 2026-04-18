import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { RecorridoTable } from './RecorridoTable.jsx'
import { RecorridoCards } from './RecorridoCards.jsx'

export function RecorridoList({
  recorridos,
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
        <RecorridoTable
          recorridos={recorridos}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <RecorridoCards
          recorridos={recorridos}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}