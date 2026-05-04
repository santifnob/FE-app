import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useCargoDistribution } from "../../../hooks/analytics/useCargoDistribution.js";

export function CargoDistributionWidget() {
  const { data = [], isLoading, isError, error } = useCargoDistribution();
  
  const chartData = data.slice(0, 6); // Top 5 + Others

  return (
    <DashboardCardShell
      title="Distribución de Carga"
      subtitle="Volumen por tipo de carga"
      badge={chartData.length ? `${chartData.length} categorías` : "Sin datos"}
      loading={isLoading}
      error={isError ? error : null}
      fallback={chartData.length === 0 && !isLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de distribución de carga.</div>
      ) : null}
      className="widget-wide"
    >
      <div className="widget-chart" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
           
            <XAxis type="number" hide />
            <YAxis 
              dataKey="categoryName" 
              type="category" 
              width={120} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              formatter={(value) => [`${value} vagones`, "Volumen"]}
            />
            <Bar 
              dataKey="wagonCount" 
              fill="#0d6efd" 
              radius={[0, 4, 4, 0]} 
              barSize={20} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCardShell>
  );
}