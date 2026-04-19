import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { EstadoTrenCards } from './EstadoTrenCards.jsx'
import { EstadoTrenTable } from './EstadoTrenTable.jsx'

export function EstadoTrenList({
  estadoTrenes,
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
        <EstadoTrenTable
          estadoTrenes={estadoTrenes}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <EstadoTrenCards
          estadoTrenes={estadoTrenes}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}