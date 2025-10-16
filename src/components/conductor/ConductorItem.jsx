import { useConductoresDelete } from "../../hooks/conductor/useConductoresDelete.js"

export function ConductorItem({ conductorData }) {
  const { mutateAsync: deleteConductor, isPending: isPendingDelete } = useConductoresDelete() 
  
  return (
    <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
      <div className="fw-bold text-wrap">
        {conductorData.nombre} {conductorData.apellido} — {conductorData.email}
      </div>
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-success btn-sm">Aceptar</button>
        <button className="btn btn-danger btn-sm" onClick={() => deleteConductor(conductorData.id)}>
          {isPendingDelete ? 'Eliminando...' : 'Rechazar'}
        </button>
      </div>
    </li>
  )
}