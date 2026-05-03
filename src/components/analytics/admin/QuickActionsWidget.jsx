import { Row, Col } from "react-bootstrap";
import { FaChartLine, FaPlusCircle, FaTools, FaUserPlus } from "react-icons/fa";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useQuickActions } from "../../../hooks/analytics/useQuickActions.js";

const iconMap = {
  "New Trip": FaPlusCircle,
  "Register Driver": FaUserPlus,
  "Train Maintenance": FaTools,
  "View Reports": FaChartLine,
};

export function QuickActionsWidget() {
  const { data = [], isLoading, isError, error } = useQuickActions();

  return (
    <DashboardCardShell
      title="Acciones Rápidas"
      subtitle="Operaciones de administración"
      badge="Atajos clave"
      loading={isLoading}
      error={isError ? error : null}
      fallback={data.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay acciones rápidas disponibles.</div>
      ) : null}
    >
      <Row className="gx-2 gy-2">
        {data.map((action) => {
          const Icon = iconMap[action.title] ?? FaChartLine;
          return (
            <Col xs={6} key={action.id}>
              <button type="button" className="btn btn-outline-primary w-100 text-start py-3 h-100">
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
  );
}
