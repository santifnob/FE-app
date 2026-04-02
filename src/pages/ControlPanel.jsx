import { useEffect, useState } from "react"
import { ConductorItem } from "../components/conductor/ConductorItem.jsx"
import { useConductoresInfinite } from "../hooks/conductor/useConductorInfinite.js"
import InfiniteScroll from "react-infinite-scroll-component"

export function ControlPanel() {
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useConductoresInfinite({filterColumn: 'estado', filterValue: 'Pendiente'})
  const [conductores , setConductores] = useState([])

  useEffect(() => {
    const conductores = data?.pages.flatMap(page => page.items) ?? []
    setConductores(conductores)
  }, [data]) // cada vez que el infinite scroll trae nuevos conductores, actualiza el estado conductores (misma logica que en useConductorCrud)

  if (isLoading) return <h1 className="text-center">Cargando...</h1>
  if (isError) return <h1 className="text-danger">{error}</h1>

  return (
    <div className="card col-12 col-sm-9 col-md-6 border-primary mx-auto " style={ { maxHeight: 400, minHeight:100} }>
      <h2 className="card-header bg-primary text-white">
        Conductores Pendientes
      </h2>
      

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


      
    </div>
  )
}