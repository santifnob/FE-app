import { Row, Col } from "react-bootstrap";
import { FaChartLine, FaPlusCircle, FaTools, FaUserPlus, FaUserClock } from "react-icons/fa";
import { ViajeForm } from "../../viaje/ViajeForm.jsx";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useState } from "react";
import { Modal } from "../../Modal.jsx";
import { ConductorForm } from "../../conductor/ConductorForm.jsx"
import { TrainRepairTable } from "./TrainRepairTable.jsx";
import { PendingDriversTable } from "./PendingDriversTable.jsx";


const iconMap = {
  "Crear Viaje": FaPlusCircle,
  "Registrar un conductor": FaUserPlus,
  "Reparación trenes": FaTools,
  "Solicitudes registro": FaUserClock,
};

const componentMap = {
  "Crear Viaje": ViajeForm,
  "Registrar un conductor": ConductorForm,
  "Reparación trenes": TrainRepairTable,
  "Solicitudes registro": PendingDriversTable,
}

export function QuickActionsWidget() {
  const quickActions = [
  { id: "qa-1", title: "Crear Viaje" },
  { id: "qa-2", title: "Registrar un conductor" },
  { id: "qa-3", title: "Reparación trenes"},
  { id: "qa-4", title: "Solicitudes registro"},
];
  const [selectedAction, setSelectedAction] = useState(null);
  const SelectedAction = componentMap[selectedAction]; // Para que funcione como componente JSX
// isLoading and isError hardcoded for now

  const handleActionClick = (action) => {
    setSelectedAction(action.title);
  }
  return (
    <>
      <DashboardCardShell
        title="Acciones Rápidas"
        subtitle="Operaciones de administración"
        badge="Atajos clave"
        loading={false}
        error={null}
        fallback={quickActions.length === 0 ? (
          <div className="text-center text-muted py-5">No hay acciones rápidas disponibles.</div>
        ) : null}
        
      >
        <div className="d-flex flex-column" style={{ height: '100%', minHeight: '300px' }}>
          <div className="d-flex flex-grow-1">
            {quickActions.slice(0, 2).map((action) => {
              const Icon = iconMap[action.title] ?? FaChartLine;
              return (
                <button
                  key={action.id}
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center text-center p-3 m-1"
                  onClick={() => handleActionClick(action)}
                  style={{
                    flex: 1,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  
                >
                  <div>
                    <span className="fs-3 d-block mb-2">
                      <Icon />
                    </span>
                    <div className="fw-semibold">{action.title}</div>
                    <div className="small opacity-75">{action.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="d-flex flex-grow-1">
            {quickActions.slice(2, 4).map((action) => {
              const Icon = iconMap[action.title] ?? FaChartLine;
              return (
                <button
                  key={action.id}
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center text-center p-3 m-1"
                  onClick={() => handleActionClick(action)}
                  style={{
                    flex: 1,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div>
                    <span className="fs-3 d-block mb-2">
                      <Icon />
                    </span>
                    <div className="fw-semibold">{action.title}</div>
                    <div className="small opacity-75">{action.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DashboardCardShell>

      {SelectedAction && (
        <Modal onClose={() => setSelectedAction(false)} title={selectedAction}>
          <SelectedAction onSuccess={() => setSelectedAction(false)} />
        </Modal>
      )}
    </>

  );
}
