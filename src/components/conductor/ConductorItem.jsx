import { useConductoresDelete } from "../../hooks/conductor/useConductoresDelete.js"
import { useConductorPut } from "../../hooks/conductor/useConductorPut.js"

export function ConductorItem({ conductorData }) {
  const { mutateAsync: deleteConductor, isPending: isPendingDelete } = useConductoresDelete() 
  const { mutateAsync: changeToApproved, isPending: isPendingUpdate } = useConductorPut()

  const handleUpdate = () => {
    conductorData.estado = "Activo";
    changeToApproved(conductorData);
  }

  return (
    <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
      <div className="fw-bold text-wrap">
        {conductorData.nombre} {conductorData.apellido} — {conductorData.email}
      </div>
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-success btn-sm" onClick={handleUpdate}>
          {isPendingUpdate ? 'Aprobando...' : 'Aceptar'}
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => deleteConductor(conductorData.id)}>
          {isPendingDelete ? 'Eliminando...' : 'Rechazar'}
        </button>
      </div>
    </li>
  )
}