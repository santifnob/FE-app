import ViajesConductorBase from "./ViajesConductorBase";
import ConductorBadgeProfile from "../../../components/conductor/ConductorBadgeProfile";

export default function CanceladosViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="Inactivo"
        titulo="🚫 Viajes Cancelados"
        emptyMessage="No tienes viajes cancelados"
      />
    </>
  );
}
