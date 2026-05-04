import { useEffect } from "react"
import { ConductorItem } from "../../conductor/ConductorItem.jsx"
import { useConductorCrud } from "../../../hooks/conductor/useConductorCrud.js"
import InfiniteScroll from "react-infinite-scroll-component"

export function PendingDriversTable() {
  const {
      conductores,
      fetchNextPage,
      handleApplyFilters,
      hasNextPage,
      isLoading,
      isError,
      error
    } = useConductorCrud()

  useEffect(() => {
    handleApplyFilters({ estado: "Pendiente" });
  }, []);

  if (isLoading) return <h1 className="text-center">Cargando...</h1>
  if (isError) return <h1 className="text-danger">{error}</h1>

  return (

    <div className="card-body bg-secondary overflow-y-scroll" id="scrolleableDiv">
      <InfiniteScroll
        dataLength={conductores.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4 className='text-center'>Cargando más conductores...</h4>}
        endMessage={<p className='text-center'>No hay más conductores</p>}
        scrollThreshold={0.8}
        scrollableTarget='scrolleableDiv'
      >
        <ul className="list-group list-group-flush">
          {conductores.map((conductor) => {
            return(
              <ConductorItem key={conductor.id} conductorData={conductor}></ConductorItem>
            )
          })}
        </ul>
      </InfiniteScroll>
    </div>


  )
}