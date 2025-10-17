import { useEffect } from "react"
import { useConductoresDelete } from "../../hooks/conductor/useConductoresDelete.js"
import { useConductorPut } from "../../hooks/conductor/useConductorPut.js"

export function ConductorItem({ conductorData }) {
  const { mutateAsync: deleteConductor, isPending: isPendingDelete, isSuccess: isSuccessDelete } = useConductoresDelete() 
  const { mutateAsync: changeToApproved, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = useConductorPut()


  const handleUpdate = () => {
    conductorData.estado = "Activo";
    changeToApproved(conductorData);
  }

  useEffect(() => {
    if (isSuccessUpdate === true) alert('Conductor aprobado con exito')
    if (isSuccessDelete === true) alert('Conductor rechazado con exito')
  }, [isSuccessUpdate, isSuccessDelete])

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