import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { ConductorCards } from './ConductorCards.jsx'
import { ConductorTable } from './ConductorTable.jsx'

export function ConductorList({
  conductores,
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
        <ConductorTable
          conductores={conductores}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <ConductorCards
          conductores={conductores}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}
