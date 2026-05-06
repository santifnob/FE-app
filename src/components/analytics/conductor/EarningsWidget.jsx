import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useConductorEarnings } from "../../../hooks/analytics/useConductorEarnings.js";

export default function ConductorEarningsWidget() {
  const { user, isLoading: userLoading } = useCurrentUser()
  const { data, isLoading, isError, error } = useConductorEarnings(user?.id)
  const total = data ?? 0

  return (
    <DashboardCardShell
      title="Ganancias"
      subtitle="Ganancias totales generadas"
      badge={`$${total.toLocaleString('es-AR')}`}
      loading={isLoading || userLoading}
      error={isError ? error : null}
      fallback={data == null && !isLoading && !userLoading && !isError ? (
        <div className="text-center text-muted py-5">No hay datos de ganancias disponibles.</div>
      ) : null}
    >
      {/* Aquí podrías agregar un gráfico o más detalles si lo desees */}
    </DashboardCardShell>
  );
}