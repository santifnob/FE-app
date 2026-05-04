import { useEstadoTrenCrud } from "../../../hooks/estadoTren/useEstadoTrenCrud.js"
import { CrudInfiniteScroll } from "../../shared/CrudInfiniteScroll.jsx"
import { Spinner, Badge, Alert } from "react-bootstrap";
import { useEffect } from "react";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TrainRepairTable(){
  const {
    estadoTrenes,
    fetchNextPage,
    handleApplyFilters,
    hasNextPage,
    isLoading,
    isError,
    error
  } = useEstadoTrenCrud()
  
  useEffect(() => {
    handleApplyFilters({ nombre: "En reparación", estado: "Activo" });
  }, []);

  if (isLoading) {
    return (
      <div className="widget-placeholder">
        <Spinner animation="border" size="sm" className="me-2" />
        <span className="text-muted">Cargando datos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger" className="py-3 mb-0">
        {error?.message ?? 'Error al cargar datos'}
      </Alert>
    );
  }

  return (
    
    <CrudInfiniteScroll
      items={estadoTrenes}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      loaderText='Cargando más trenes en reparación...'
      endText='No hay más trenes en reparación'
    >
      <div className="table-responsive">
      <table className="table table-borderless table-sm mb-0">
        <thead>
          <tr>
            <th>Tren</th>
            <th className="text-end">Fecha vigencia</th>
          </tr>
        </thead>
        <tbody>
          {estadoTrenes.map((estado) => (
            <tr key={estado.id}>
              <td>#{estado.tren.id} - {estado.tren.modelo} </td>
              <td className="text-end">
                <div className="d-flex flex-column align-align-items-center gap-1">
                  <div className="d-flex align-items-center gap-2 justify-content-end">
                    <Badge bg="warning" pill>
                      {formatDate(estado.fechaVigencia)} 
                    </Badge>
                    
                  </div>
                  <div className="text-muted small">{formatTime(estado.fechaVigencia)}</div>
                </div> 
                
                
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CrudInfiniteScroll>

    
  )
}