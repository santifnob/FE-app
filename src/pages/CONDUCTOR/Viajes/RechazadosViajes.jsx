import ViajesConductorBase from "./ViajesConductorBase";
import ConductorBadgeProfile from "../../../components/conductor/ConductorBadgeProfile";

export default function RechazadosViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="Rechazado"
        titulo="❌ Viajes Rechazados"
        emptyMessage="No tienes viajes rechazados"
      />
    </>
  )
}