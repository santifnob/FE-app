import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useCargoDistribution } from "../../../hooks/analytics/useCargoDistribution.js";

export function CargoDistributionWidget() {
  const { data = [], isLoading, isError, error } = useCargoDistribution();

  const addOthersCategory = (data) => { // Lógica para agregar categoría "Otros" en caso de que el total de categorías sea mayor a 5
    if (!data || data.length === 0) return [];

    const totalGlobalWagons = data[0].totalWagonCount;
    const top5WagonsCount = data.reduce((acc, row) => acc + Number(row.wagonCount), 0);

    if(totalGlobalWagons == top5WagonsCount) return data

    const top5RevenuePerc = data.reduce((acc, row) => acc + Number(row.revenuePercentage), 0);

    console.log(top5WagonsCount)
    console.log(top5RevenuePerc)

    const othersRow = {
      categoryName: 'Otros',
      wagonCount: totalGlobalWagons - top5WagonsCount,
      revenuePercentage: 100 - top5RevenuePerc, 
    };

    return [...data, othersRow];
  }

  const chartData = addOthersCategory(data);

  return (
    <DashboardCardShell
      title="Distribución de Carga"
      subtitle="Ingresos y volumen transportado por categoría de carga"
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
              content={<CustomTooltip />}
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
          Vagones: {Number(data.wagonCount)}
        </p>
        <p style={{ margin: 0 }}>
          Porcentaje de ingresos: {Number(data.revenuePercentage).toFixed(2)}%
        </p>
      </div>
    );
  }

  return null;
};