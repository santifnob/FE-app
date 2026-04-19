import { CrudResponsiveList } from '../shared/CrudResponsiveList.jsx'
import { TipoCargaCards } from './TipoCargaCards.jsx'
import { TipoCargaTable } from './TipoCargaTable.jsx'

export function TipoCargaList({
  tipoCargas,
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
        <TipoCargaTable
          tipoCargas={tipoCargas}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
          handleAscOrder={handleAscOrder}
          ascOrder={ascOrder}
        />
      }
      mobile={
        <TipoCargaCards
          tipoCargas={tipoCargas}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          handleEdit={handleEdit}
          deleteMutation={deleteMutation}
        />
      }
    />
  )
}
