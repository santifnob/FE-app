import { useEffect, useState } from "react"
import { ConductorItem } from "../../conductor/ConductorItem.jsx"
import { useConductorCrud } from "../../../hooks/conductor/useConductorCrud.js"
import InfiniteScroll from "react-infinite-scroll-component"
import { MdCheckCircle } from "react-icons/md"

export function PendingDriversTable() {
  const [globalFeedback, setGlobalFeedback] = useState(null);
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

  const showMessage = (msg) => {
    setGlobalFeedback(msg);
    setTimeout(() => setGlobalFeedback(null), 3000);
  };

  if (isLoading) return <h1 className="text-center">Cargando...</h1>
  if (isError) return <h1 className="text-danger">{error}</h1>

  return (
    
    <div className="card-body bg-secondary overflow-y-scroll" id="scrolleableDiv">
      {globalFeedback && (
        <div className="d-flex align-items-center gap-2 text-success fw-semibold justify-content-center" style={{ color: 'green' }}>
          <MdCheckCircle size={24} />
          <span>{globalFeedback}</span>
        </div>
      )}

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
              <ConductorItem 
                key={conductor.id} 
                conductorData={conductor} 
                onActionSuccess={showMessage}
              />
            )
          })}
        </ul>
      </InfiniteScroll>
    </div>


  )
}