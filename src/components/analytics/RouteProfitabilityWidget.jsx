import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardCardShell from "../dashboard/DashboardCardShell.jsx";
import { useRouteProfitability } from "../../hooks/analytics/useRouteProfitability.js";

export function RouteProfitabilityWidget() {
  const { data = [], isLoading, isError, error } = useRouteProfitability();
  const chartData = [...data].sort((a, b) => b.profitPerKm - a.profitPerKm).slice(0, 5);

  return (
    <DashboardCardShell
      title="Rentabilidad por Ruta"
      subtitle="Ingresos por kilómetro en rutas clave"
      badge={chartData.length ? `${chartData.length} rutas` : "Sin datos de ruta"}
      loading={isLoading}
      error={isError ? error : null}
      fallback={chartData.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de rentabilidad disponibles.</div>
      ) : null}
      className="widget-wide"
    >
      <div className="widget-chart" style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="routeName"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString("es-AR")}`} />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString("es-AR")}`, "ARS/km"]}
            />
            <Bar dataKey="profitPerKm" fill="#0d6efd" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCardShell>
  );
}
