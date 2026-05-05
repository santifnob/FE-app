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

  const isLowVolume = data.tripsCount < 400; 

  return (
    <DashboardCardShell
      title={`Riesgo de Cancelación`}
      subtitle={`Probabilidad general y rutas con riesgo mayor a 5%. ${isLowVolume ? `Muestra estadística limitada (n = ${data.tripsCount})` : ""}`}
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
                  cy="60%"
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
            <small className="text-muted">Tasa de cancelación general</small>
          </div>
        </div>

        <div>
          <h6>Perspectivas de datos</h6>
          <div className="d-flex justify-content-between">
            <small className="text-muted">Ruta de alto riesgo:</small>
            <small className="text-muted">Tendencia/mes anterior:</small>
          </div>
          {data.topRiskRoutes.map((route, index) => (
            <div key={index} className="d-flex justify-content-between mt-2">
              <div>
                <div className="text-danger">
                  {route.routeName} ({route.rate}%)
                </div>
              </div>
              <div>
                <div className={route.trend.startsWith("+") ? "text-danger" : "text-success"}>
                  {route.trend} 
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </DashboardCardShell>
  );
}