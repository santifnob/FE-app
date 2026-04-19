import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { LicenciaCards } from './LicenciaCards.jsx'
import { LicenciaTable } from './LicenciaTable.jsx'

export function LicenciaList({
  licencias,
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
        <LicenciaTable
          licencias={licencias}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <LicenciaCards
          licencias={licencias}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}
