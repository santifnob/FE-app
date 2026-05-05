import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useCancellationRisk } from "../../../hooks/analytics/useCancellationRisk.js";

const COLORS = ["#dc3545", "#ffc107", "#28a745"];

export function CancellationRiskWidget() {
  const { data, isLoading, isError, error } = useCancellationRisk();

  if (!data) return null;

  const gaugeData = [
    { name: "Cancelaciones", value: data.overallRate, fill: "#dc3545" },
    { name: "Restante", value: 100 - data.overallRate, fill: "#e9ecef" },
  ];

  return (
    <DashboardCardShell
      title="Riesgo de Cancelación"
      subtitle="Probabilidad general y rutas de alto riesgo"
      badge={`${data.overallRate}% riesgo`}
      loading={isLoading}
      error={isError ? error : null}
      fallback={!data && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de riesgo de cancelación.</div>
      ) : null}
      className="widget-wide"
    >
      <div className="d-flex flex-column h-100">
        {/* Top half: Gauge Chart */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div style={{ width: "200px", height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ms-3 text-center">
            <h2 className="mb-0">{data.overallRate}%</h2>
            <small className="text-muted">Tasa de cancelación</small>
          </div>
        </div>

        {/* Bottom half: Insights */}
        <div className="mt-3">
          <h6>Insights</h6>
          <div className="d-flex justify-content-between">
            <div>
              <small className="text-muted">Tendencia:</small>
              <div className={data.trend.startsWith("+") ? "text-danger" : "text-success"}>
                {data.trend} vs mes anterior
              </div>
            </div>
            <div>
              <small className="text-muted">Ruta de alto riesgo:</small>
              <div className="text-danger">
                {data.topRiskRoutes[0]?.route} ({data.topRiskRoutes[0]?.rate}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCardShell>
  );
}