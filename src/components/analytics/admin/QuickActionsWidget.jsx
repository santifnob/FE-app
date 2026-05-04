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
  { id: "qa-1", title: "Crear Viaje", description: "Programar un nuevo servicio" },
  { id: "qa-2", title: "Registrar un conductor" },
  { id: "qa-3", title: "Reparación trenes", description: "Revisar revisiones próximas o actuales" },
  { id: "qa-4", title: "Solicitudes registro", description: "Ver los conductores pendientes de aprobación" },
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
        <Row className="gx-2 gy-2">
          {quickActions.map((action) => {
            const Icon = iconMap[action.title] ?? FaChartLine;
            return (
              <Col xs={6} key={action.id}>
                <button type="button" className="btn btn-outline-primary w-100 text-start py-3 h-100" onClick={() => handleActionClick(action)}>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-4">
                      <Icon />
                    </span>
                    <div>
                      <div className="fw-semibold">{action.title}</div>
                      <div className="small text-muted">{action.description}</div>
                    </div>
                  </div>
                </button>
              </Col>
            );
          })}
        </Row>
      </DashboardCardShell>

      {SelectedAction && (
        <Modal onClose={() => setSelectedAction(false)} title={selectedAction}>
          <SelectedAction onSuccess={() => setSelectedAction(false)} />
        </Modal>
      )}
    </>

  );
}
