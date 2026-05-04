
import { MdCheckCircle } from "react-icons/md";
import { useConductoresDelete } from "../../hooks/conductor/useConductoresDelete.js";
import { useConductorPut } from "../../hooks/conductor/useConductorPut.js";

export function ConductorItem({ conductorData, onActionSuccess }) {
  const { mutateAsync: deleteConductor, isPending: isPendingDelete } = useConductoresDelete();
  const { mutateAsync: changeToApproved, isPending: isPendingUpdate } = useConductorPut();

  const handleUpdate = async () => {
    try {
      await changeToApproved({ ...conductorData, estado: "Activo" });
      onActionSuccess("Conductor aprobado con éxito");
      
    } catch (error) {
      console.error("Error al actualizar el conductor:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteConductor(conductorData.id);
      onActionSuccess("Conductor rechazado con éxito");
    } catch (error) {
      console.error("Error al eliminar el conductor:", error);
    }
  };

  return (
    <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">

          <div className="fw-bold text-wrap">
            {conductorData.nombre} {conductorData.apellido} — {conductorData.email}
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button 
              className="btn btn-success btn-sm" 
              onClick={handleUpdate}
              disabled={isPendingUpdate || isPendingDelete}
            >
              {isPendingUpdate ? 'Aprobando...' : 'Aceptar'}
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={handleDelete}
              disabled={isPendingUpdate || isPendingDelete}
            >
              {isPendingDelete ? 'Eliminando...' : 'Rechazar'}
            </button>
          </div>

    </li>
  );
}