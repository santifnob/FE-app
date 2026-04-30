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

  return (
    <DashboardCardShell
      title="Rentabilidad por Ruta"
      subtitle="Ingresos por kilómetro en rutas clave de los últimos 6 meses"
      badge={data.length ? `${data.length} rutas` : "Sin datos de ruta"}
      loading={isLoading}
      error={isError ? error : null}
      fallback={data.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de rentabilidad disponibles.</div>
      ) : null}
      className="widget-wide"
    >
      <div className="widget-chart" style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 80 }}>
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
            <Tooltip content={<CustomTooltip />}/>
            <Bar dataKey="profitPerKm" fill="#0d6efd" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCardShell>
  );
}


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "10px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0 }}>
          Rentabilidad: ${Number(data.profitPerKm).toLocaleString("es-AR")} / km
        </p>
        <p style={{ margin: 0 }}>
          Viajes: {data.tripsCount}
        </p>
      </div>
    );
  }

  return null;
};